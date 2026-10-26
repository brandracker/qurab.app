package app.qurb.serene;

import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AdMobPlugin.class);
        registerPlugin(GooglePlayBillingPlugin.class);
        registerPlugin(GoogleAuthPlugin.class);
        registerPlugin(FacebookEventsPlugin.class);
        super.onCreate(savedInstanceState);
        try {
            com.facebook.FacebookSdk.setAutoInitEnabled(true);
            com.facebook.FacebookSdk.setAutoLogAppEventsEnabled(true);
            com.facebook.FacebookSdk.setAdvertiserIDCollectionEnabled(true);
            com.facebook.appevents.AppEventsLogger.activateApp(getApplication());
        } catch (Exception ignored) {}

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        getWindow().addFlags(
            android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
            android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
            android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        );

        handleDeepLink(getIntent());
        setupWebRtcMediaPermissions();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        handleDeepLink(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        checkAndRequestCallingPermissions();
    }

    private void setupWebRtcMediaPermissions() {
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebSettings settings = getBridge().getWebView().getSettings();
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);

            final AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            getBridge().getWebView().addJavascriptInterface(new AndroidAudioBridge(this, audioManager), "AndroidAudioBridge");

            getBridge().getWebView().setWebChromeClient(new BridgeWebChromeClient(getBridge()) {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    runOnUiThread(() -> {
                        String[] resources = request.getResources();
                        request.grant(resources);
                    });
                }
            });
        }
    }

    private void checkAndRequestCallingPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            String[] perms = new String[]{
                android.Manifest.permission.CAMERA,
                android.Manifest.permission.RECORD_AUDIO,
                android.Manifest.permission.MODIFY_AUDIO_SETTINGS
            };
            boolean needsPerm = false;
            for (String p : perms) {
                if (checkSelfPermission(p) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    needsPerm = true;
                    break;
                }
            }
            if (needsPerm) {
                requestPermissions(perms, 1002);
            }
        }
    }


    private void handleDeepLink(Intent intent) {
        if (intent == null) return;

        // Dismiss incoming call notification if app opened
        try {
            android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) {
                nm.cancel(999999);
            }
        } catch (Exception ignored) {}

        // Handle incoming call action or extras
        if ("incoming_call".equals(intent.getStringExtra("type")) || "app.qurb.serene.ACTION_INCOMING_CALL".equals(intent.getAction())) {
            String callerId = intent.getStringExtra("callerId");
            String callerName = intent.getStringExtra("callerName");
            String callType = intent.getStringExtra("callType");
            String callerPhoto = intent.getStringExtra("callerPhoto");
            String conversationId = intent.getStringExtra("conversationId");
            String callAction = intent.getStringExtra("call_action");

            String safeName = callerName != null ? callerName.replace("'", "\\'") : "Match Candidate";
            String safeId = callerId != null ? callerId : "";
            String safeType = callType != null ? callType : "audio";
            String safePhoto = callerPhoto != null ? callerPhoto : "";
            String safeConv = conversationId != null ? conversationId : "";
            String safeAction = callAction != null ? callAction : "view";

            String js = "window.dispatchEvent(new CustomEvent('qurb_incoming_call_push', { detail: { " +
                "type: 'incoming_call'," +
                "callerId: '" + safeId + "'," +
                "callerName: '" + safeName + "'," +
                "callType: '" + safeType + "'," +
                "callerPhoto: '" + safePhoto + "'," +
                "conversationId: '" + safeConv + "'," +
                "callAction: '" + safeAction + "'" +
                "} }));";
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().postDelayed(() -> {
                    getBridge().getWebView().evaluateJavascript(js, null);
                }, 800);
            }
        }

        if (intent.getData() == null) return;
        Uri data = intent.getData();
        String uriString = data.toString();
        if ("qurb".equalsIgnoreCase(data.getScheme()) || (uriString != null && uriString.contains("stripe_status="))) {
            String stripeStatus = data.getQueryParameter("stripe_status");
            String sessionId = data.getQueryParameter("session_id");
            if (stripeStatus != null) {
                String safeSessionId = sessionId != null ? sessionId : "";
                String js = "window.dispatchEvent(new CustomEvent('app_stripe_callback', { detail: { stripe_status: '" + stripeStatus + "', session_id: '" + safeSessionId + "' } }));";
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().postDelayed(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }, 600);
                }
            }
        }
    }

    public static class AndroidAudioBridge {
        private final BridgeActivity activity;
        private final AudioManager audioManager;

        public AndroidAudioBridge(BridgeActivity activity, AudioManager audioManager) {
            this.activity = activity;
            this.audioManager = audioManager;
        }

        @JavascriptInterface
        public void setCallMode(boolean inCall) {
            if (activity != null) {
                activity.runOnUiThread(() -> {
                    if (audioManager != null) {
                        try {
                            if (inCall) {
                                audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
                            } else {
                                audioManager.setSpeakerphoneOn(false);
                                audioManager.setMode(AudioManager.MODE_NORMAL);
                            }
                        } catch (Exception ignored) {}
                    }
                });
            }
        }

        @JavascriptInterface
        public void setSpeakerphoneOn(boolean on) {
            if (activity != null) {
                activity.runOnUiThread(() -> {
                    if (audioManager != null) {
                        try {
                            if (audioManager.getMode() != AudioManager.MODE_IN_COMMUNICATION) {
                                audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
                            }
                            audioManager.setSpeakerphoneOn(on);
                        } catch (Exception ignored) {}
                    }
                });
            }
        }

        @JavascriptInterface
        public boolean isSpeakerphoneOn() {
            if (audioManager != null) {
                try {
                    return audioManager.isSpeakerphoneOn();
                } catch (Exception ignored) {}
            }
            return false;
        }
    }
}
