package app.qurb.serene;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

/**
 * Qurb Production Native Firebase Messaging Service
 * Intercepts VoIP incoming call push notifications to wake up the screen,
 * play continuous ringtone, and launch Full-Screen Intent (WhatsApp style).
 */
public class QurbFirebaseMessagingService extends MessagingService {
    private static final String TAG = "QurbFCM";
    public static final String CHANNEL_CALLS_ID = "qurb_calls";
    public static final int CALL_NOTIFICATION_ID = 999999;

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        Log.d(TAG, "FCM message received. Data: " + data);

        if (data != null && "incoming_call".equals(data.get("type"))) {
            handleIncomingCall(remoteMessage, data);
        } else {
            // Forward regular messages, matches, and notifications to Capacitor
            super.onMessageReceived(remoteMessage);
        }
    }

    private void handleIncomingCall(@NonNull RemoteMessage remoteMessage, Map<String, String> data) {
        String callerName = data.get("callerName");
        if (callerName == null || callerName.trim().isEmpty()) {
            callerName = "Match Candidate";
        }
        String callType = data.get("callType");
        if (callType == null) callType = "audio";
        String callerId = data.get("callerId") != null ? data.get("callerId") : "";
        String conversationId = data.get("conversationId") != null ? data.get("conversationId") : "";
        String callerPhoto = data.get("callerPhoto") != null ? data.get("callerPhoto") : "";

        // 1. Wake up the screen if locked (PowerManager WakeLock)
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                @SuppressWarnings("deprecation")
                PowerManager.WakeLock wakeLock = pm.newWakeLock(
                    PowerManager.SCREEN_BRIGHT_WAKE_LOCK | PowerManager.ACQUIRE_CAUSES_WAKEUP,
                    "qurb:incoming_call_wakelock"
                );
                wakeLock.acquire(15000); // Hold screen wake for 15 seconds
            }
        } catch (Exception e) {
            Log.w(TAG, "Failed to acquire screen WakeLock: " + e.getMessage());
        }

        // 2. Ensure high-importance notification channel with Ringtone
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Uri ringtoneUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm != null) {
            NotificationChannel channel = nm.getNotificationChannel(CHANNEL_CALLS_ID);
            if (channel == null) {
                channel = new NotificationChannel(
                    CHANNEL_CALLS_ID,
                    "Incoming Calls",
                    NotificationManager.IMPORTANCE_HIGH
                );
                channel.setDescription("Full-screen incoming audio and video calls");
                channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{0, 1000, 800, 1000, 800});
                
                AudioAttributes audioAttributes = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .build();
                channel.setSound(ringtoneUri, audioAttributes);
                nm.createNotificationChannel(channel);
            }
        }

        int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
        }

        // 3. Full-screen intent to wake and show call screen
        Intent fullScreenIntent = new Intent(this, MainActivity.class);
        fullScreenIntent.setAction("app.qurb.serene.ACTION_INCOMING_CALL");
        fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        fullScreenIntent.putExtra("type", "incoming_call");
        fullScreenIntent.putExtra("callerName", callerName);
        fullScreenIntent.putExtra("callType", callType);
        fullScreenIntent.putExtra("callerId", callerId);
        fullScreenIntent.putExtra("conversationId", conversationId);
        fullScreenIntent.putExtra("callerPhoto", callerPhoto);
        fullScreenIntent.putExtra("call_action", "view");

        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
            this,
            1001,
            fullScreenIntent,
            pendingFlags
        );

        // 4. Accept Action Intent
        Intent acceptIntent = new Intent(this, MainActivity.class);
        acceptIntent.setAction("app.qurb.serene.ACTION_INCOMING_CALL");
        acceptIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        acceptIntent.putExtra("type", "incoming_call");
        acceptIntent.putExtra("callerName", callerName);
        acceptIntent.putExtra("callType", callType);
        acceptIntent.putExtra("callerId", callerId);
        acceptIntent.putExtra("conversationId", conversationId);
        acceptIntent.putExtra("callerPhoto", callerPhoto);
        acceptIntent.putExtra("call_action", "accept");

        PendingIntent acceptPendingIntent = PendingIntent.getActivity(
            this,
            1002,
            acceptIntent,
            pendingFlags
        );

        // 5. Decline Broadcast Intent
        Intent declineIntent = new Intent(this, CallDismissReceiver.class);
        declineIntent.setAction("app.qurb.serene.ACTION_DECLINE_CALL");
        declineIntent.putExtra("notificationId", CALL_NOTIFICATION_ID);
        declineIntent.putExtra("callerId", callerId);

        PendingIntent declinePendingIntent = PendingIntent.getBroadcast(
            this,
            1003,
            declineIntent,
            pendingFlags
        );

        // 6. Build the notification
        String title = "Incoming " + (callType.equals("video") ? "Video" : "Audio") + " Call 📞";
        String body = callerName + " is calling you on Qurb...";

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_CALLS_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setAutoCancel(true)
            .setOngoing(true)
            .setTimeoutAfter(35000)
            .setSound(ringtoneUri)
            .setVibrate(new long[]{0, 1000, 800, 1000, 800})
            .setContentIntent(fullScreenPendingIntent)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Decline", declinePendingIntent)
            .addAction(android.R.drawable.ic_menu_call, "Accept", acceptPendingIntent);

        if (nm != null) {
            nm.notify(CALL_NOTIFICATION_ID, builder.build());
        }

        // Also notify Capacitor plugin in case WebView is active in memory
        try {
            PushNotificationsPlugin.sendRemoteMessage(remoteMessage);
        } catch (Exception e) {
            Log.w(TAG, "Notice forwarding remote message to Capacitor: " + e.getMessage());
        }
    }
}
