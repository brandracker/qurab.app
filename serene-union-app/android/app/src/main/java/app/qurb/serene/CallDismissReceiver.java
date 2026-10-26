package app.qurb.serene;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * BroadcastReceiver for declining incoming call notifications directly from notification actions.
 */
public class CallDismissReceiver extends BroadcastReceiver {
    private static final String TAG = "CallDismissReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        int notificationId = intent.getIntExtra("notificationId", 999999);
        Log.d(TAG, "Dismissing incoming call notification ID: " + notificationId);

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            nm.cancel(notificationId);
        }
    }
}
