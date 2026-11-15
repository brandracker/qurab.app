package app.qurb.serene;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

/**
 * BroadcastReceiver for declining incoming call notifications directly from notification actions.
 */
public class CallDismissReceiver extends BroadcastReceiver {
    private static final String TAG = "CallDismissReceiver";
    private static final String CALL_SIGNAL_URL = "https://serene-union-api.brandracker.workers.dev/api/conversations/call/signal";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        int notificationId = intent.getIntExtra("notificationId", 999999);
        final String conversationId = intent.getStringExtra("conversationId");
        final String callerId = intent.getStringExtra("callerId");
        Log.d(TAG, "Declining/dismissing incoming call notification ID: " + notificationId);

        MainActivity.sPendingIncomingCallPayload = null;

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.cancel(notificationId);
        }

        if (conversationId != null && !conversationId.trim().isEmpty()) {
            final PendingResult pendingResult = goAsync();
            new Thread(() -> {
                HttpURLConnection conn = null;
                try {
                    URL url = new URL(CALL_SIGNAL_URL);
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setConnectTimeout(5000);
                    conn.setReadTimeout(5000);
                    conn.setDoOutput(true);

                    JSONObject innerPayload = new JSONObject();
                    innerPayload.put("reason", "declined");

                    JSONObject signalPayload = new JSONObject();
                    signalPayload.put("signal", "reject");
                    signalPayload.put("type", "call_ended");
                    if (callerId != null && !callerId.trim().isEmpty()) {
                        signalPayload.put("targetUserId", callerId);
                    }
                    signalPayload.put("payload", innerPayload);

                    JSONObject body = new JSONObject();
                    body.put("conversationId", conversationId);
                    body.put("payload", signalPayload);

                    byte[] bytes = body.toString().getBytes(StandardCharsets.UTF_8);
                    try (OutputStream os = conn.getOutputStream()) {
                        os.write(bytes);
                    }
                    conn.getResponseCode();
                } catch (Exception e) {
                    Log.w(TAG, "Failed to dispatch decline call signal: " + e.getMessage());
                } finally {
                    if (conn != null) conn.disconnect();
                    pendingResult.finish();
                }
            }).start();
        }
    }
}
