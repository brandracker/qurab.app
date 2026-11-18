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
    public static volatile String sPendingIncomingCallPayload = null;
    private PermissionRequest pendingWebRtcPermissionRequest = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MetaAdsPlugin.class);
        registerPlugin(AdMobPlugin.class);
        registerPlugin(GooglePlayBillingPlugin.class);
        registerPlugin(GoogleAuthPlugin.class);
        registerPlugin(FacebookEventsPlugin.class);
        registerPlugin(AppUpdatePlugin.class);
        super.onCreate(savedInstanceState);
        try {
            com.facebook.ads.AudienceNetworkAds.initialize(this);
            com.facebook.FacebookSdk.setAutoInitEnabled(true);
            com.facebook.FacebookSdk.setAutoLogAppEventsEnabled(true);
            com.facebook.FacebookSdk.setAdvertiserIDCollectionEnabled(true);
            com.facebook.appevents.AppEventsLogger.activateApp(getApplication());
        } catch (Exception ignored) {}

        handleDeepLink(getIntent());
        setupWebRtcMediaPermissions();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleDeepLink(intent);
    }

    private void enableIncomingCallLockScreenFlags() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            try {
                android.app.KeyguardManager km = (android.app.KeyguardManager) getSystemService(Context.KEYGUARD_SERVICE);
                if (km != null) {
                    km.requestDismissKeyguard(this, null);
                }
            } catch (Exception ignored) {}
        }
        getWindow().addFlags(
            android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON |
            android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD |
            android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED |
            android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        );
    }

    private String escapeJsString(String val) {
        if (val == null) return "";
        return val
            .replace("\\", "\\\\")
            .replace("'", "\\'")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r");
    }

    @Override
    public void onResume() {
        super.onResume();
        // Just-In-Time Permissions: Calling and camera permissions are requested on-demand
        // when a call or photo action is initiated, avoiding user suspicion on startup.
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
                        Uri origin = request.getOrigin();
                        String host = (origin != null && origin.getHost() != null) ? origin.getHost().toLowerCase() : "";
                        if ("localhost".equals(host) || "qurb.app".equals(host) || host.endsWith(".qurb.app")) {
                            String[] resources = request.getResources();
                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                                java.util.List<String> missingPerms = new java.util.ArrayList<>();
                                for (String res : resources) {
                                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(res) &&
                                        checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                                        missingPerms.add(android.Manifest.permission.RECORD_AUDIO);
                                    } else if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(res) &&
                                        checkSelfPermission(android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                                        missingPerms.add(android.Manifest.permission.CAMERA);
                                    }
                                }
                                if (!missingPerms.isEmpty()) {
                                    if (pendingWebRtcPermissionRequest != null) {
                                        try { pendingWebRtcPermissionRequest.deny(); } catch (Exception ignored) {}
                                    }
                                    pendingWebRtcPermissionRequest = request;
                                    requestPermissions(missingPerms.toArray(new String[0]), 1003);
                                    return;
                                }
                            }
                            request.grant(resources);
                        } else {
                            request.deny();
                        }
                    });
                }
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean allGranted = grantResults != null && grantResults.length > 0;
        if (allGranted) {
            for (int res : grantResults) {
                if (res != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
        }

        if (requestCode == 1003 && pendingWebRtcPermissionRequest != null) {
            final PermissionRequest req = pendingWebRtcPermissionRequest;
            pendingWebRtcPermissionRequest = null;
            runOnUiThread(() -> {
                try {
                    boolean audioOk = android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.M ||
                        checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) == android.content.pm.PackageManager.PERMISSION_GRANTED;
                    boolean camOk = android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.M ||
                        checkSelfPermission(android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED;
                    java.util.List<String> grantedResources = new java.util.ArrayList<>();
                    for (String r : req.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && audioOk) {
                            grantedResources.add(r);
                        } else if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && camOk) {
                            grantedResources.add(r);
                        }
                    }
                    if (!grantedResources.isEmpty()) {
                        req.grant(grantedResources.toArray(new String[0]));
                    } else {
                        req.deny();
                    }
                } catch (Exception ignored) {}
            });
        }

        if (requestCode == 1002 || requestCode == 1003) {
            final boolean grantedFlag = allGranted;
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().post(() -> {
                    getBridge().getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('qurb_native_permissions_result', { detail: { granted: " + grantedFlag + " } }));",
                        null
                    );
                });
            }
        }
    }

    private void checkAndRequestCallingPermissions() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            java.util.List<String> permsList = new java.util.ArrayList<>();
            permsList.add(android.Manifest.permission.CAMERA);
            permsList.add(android.Manifest.permission.RECORD_AUDIO);
            permsList.add(android.Manifest.permission.MODIFY_AUDIO_SETTINGS);
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                permsList.add(android.Manifest.permission.BLUETOOTH_CONNECT);
            }
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                permsList.add(android.Manifest.permission.POST_NOTIFICATIONS);
            }

            java.util.List<String> needed = new java.util.ArrayList<>();
            for (String p : permsList) {
                if (checkSelfPermission(p) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    needed.add(p);
                }
            }
            if (!needed.isEmpty()) {
                requestPermissions(needed.toArray(new String[0]), 1002);
            }
        }

        // Android 14+ Full-Screen Intent Permission Handler (TASK-A1)
        if (android.os.Build.VERSION.SDK_INT >= 34) {
            try {
                android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null && !nm.canUseFullScreenIntent()) {
                    android.content.SharedPreferences sp = getSharedPreferences("qurb_calling_prefs", Context.MODE_PRIVATE);
                    boolean alreadyPrompted = sp.getBoolean("fsi_prompted", false);
                    if (!alreadyPrompted) {
                        sp.edit().putBoolean("fsi_prompted", true).apply();
                        Intent fsIntent = new Intent(android.provider.Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT);
                        fsIntent.setData(Uri.parse("package:" + getPackageName()));
                        fsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(fsIntent);
                    }
                }
            } catch (Exception ignored) {}
        }

        // Battery Optimization Exemption Handler (TASK-A2)
        checkBatteryOptimizationExemption();
    }

    private void checkBatteryOptimizationExemption() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            try {
                android.os.PowerManager pm = (android.os.PowerManager) getSystemService(Context.POWER_SERVICE);
                if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
                    android.content.SharedPreferences sp = getSharedPreferences("qurb_calling_prefs", Context.MODE_PRIVATE);
                    boolean alreadyPrompted = sp.getBoolean("battery_prompted", false);
                    if (!alreadyPrompted) {
                        sp.edit().putBoolean("battery_prompted", true).apply();
                        Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                        intent.setData(Uri.parse("package:" + getPackageName()));
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(intent);
                    }
                }
            } catch (Exception ignored) {}
        }
    }


    private String getExtraStringSafe(Intent intent, String key) {
        if (intent == null || key == null) return null;
        try {
            String val = intent.getStringExtra(key);
            if (val != null) return val;
            Bundle extras = intent.getExtras();
            if (extras != null && extras.containsKey(key)) {
                Object obj = extras.get(key);
                return obj != null ? obj.toString() : null;
            }
        } catch (Exception ignored) {}
        return null;
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
        String callTypeExtra = getExtraStringSafe(intent, "type");
        if ("incoming_call".equals(callTypeExtra) || "app.qurb.serene.ACTION_INCOMING_CALL".equals(intent.getAction())) {
            enableIncomingCallLockScreenFlags();
            String callerId = getExtraStringSafe(intent, "callerId");
            String callerName = getExtraStringSafe(intent, "callerName");
            String callType = getExtraStringSafe(intent, "callType");
            String callerPhoto = getExtraStringSafe(intent, "callerPhoto");
            String conversationId = getExtraStringSafe(intent, "conversationId");
            String callAction = getExtraStringSafe(intent, "call_action");

            String safeName = escapeJsString(callerName != null ? callerName : "Match Candidate");
            String safeId = escapeJsString(callerId);
            String safeType = escapeJsString(callType != null ? callType : "audio");
            String safePhoto = escapeJsString(callerPhoto);
            String safeConv = escapeJsString(conversationId);
            String safeAction = escapeJsString(callAction != null ? callAction : "view");

            String jsonPayload = "{" +
                "\"type\":\"incoming_call\"," +
                "\"callerId\":\"" + safeId + "\"," +
                "\"callerName\":\"" + safeName + "\"," +
                "\"callType\":\"" + safeType + "\"," +
                "\"callerPhoto\":\"" + safePhoto + "\"," +
                "\"conversationId\":\"" + safeConv + "\"," +
                "\"callAction\":\"" + safeAction + "\"" +
                "}";
            sPendingIncomingCallPayload = jsonPayload;

            String js = "window.dispatchEvent(new CustomEvent('qurb_incoming_call_push', { detail: " + jsonPayload + " }));";
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().postDelayed(() -> {
                    getBridge().getWebView().evaluateJavascript(js, null);
                }, 400);
                getBridge().getWebView().postDelayed(() -> {
                    getBridge().getWebView().evaluateJavascript(js, null);
                }, 1200);
                getBridge().getWebView().postDelayed(() -> {
                    if (sPendingIncomingCallPayload != null) {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }
                }, 2500);
            }
            try {
                intent.removeExtra("type");
                intent.removeExtra("call_action");
            } catch (Exception ignored) {}
        } else {
            // Handle chat notification or general notification redirection (Cold boot and Background resume)
            String convId = getExtraStringSafe(intent, "conversationId");
            String notifType = getExtraStringSafe(intent, "type");
            String targetTab = getExtraStringSafe(intent, "targetTab");

            if (convId != null && !convId.trim().isEmpty()) {
                String safeConv = escapeJsString(convId);
                String js = "window.dispatchEvent(new CustomEvent('qurb_open_chat', { detail: { conversationId: '" + safeConv + "' } }));";
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().postDelayed(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }, 500);
                    getBridge().getWebView().postDelayed(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }, 1400);
                }
            } else if ("like".equals(notifType) || "match".equals(notifType) || "matches".equals(targetTab)) {
                String js = "window.dispatchEvent(new CustomEvent('qurb_navigate_tab', { detail: { tab: 'matches' } }));";
                if (getBridge() != null && getBridge().getWebView() != null) {
                    getBridge().getWebView().postDelayed(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }, 500);
                    getBridge().getWebView().postDelayed(() -> {
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }, 1400);
                }
            }
        }

        if (intent.getData() == null) return;
        Uri data = intent.getData();
        String uriString = data.toString();
        if ("qurb".equalsIgnoreCase(data.getScheme()) || (uriString != null && uriString.contains("stripe_status="))) {
            String stripeStatus = data.getQueryParameter("stripe_status");
            String sessionId = data.getQueryParameter("session_id");
            if (stripeStatus != null) {
                String safeStatus = escapeJsString(stripeStatus);
                String safeSessionId = escapeJsString(sessionId);
                String js = "window.dispatchEvent(new CustomEvent('app_stripe_callback', { detail: { stripe_status: '" + safeStatus + "', session_id: '" + safeSessionId + "' } }));";
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
        private android.media.AudioFocusRequest activeAudioFocusRequest = null;

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
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                                    android.media.AudioAttributes attrs = new android.media.AudioAttributes.Builder()
                                        .setUsage(android.media.AudioAttributes.USAGE_VOICE_COMMUNICATION)
                                        .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SPEECH)
                                        .build();
                                    activeAudioFocusRequest = new android.media.AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
                                        .setAudioAttributes(attrs)
                                        .setOnAudioFocusChangeListener(focusChange -> {})
                                        .build();
                                    audioManager.requestAudioFocus(activeAudioFocusRequest);
                                } else {
                                    audioManager.requestAudioFocus(null, AudioManager.STREAM_VOICE_CALL, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
                                }
                                try {
                                    android.app.NotificationManager nm = (android.app.NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
                                    if (nm != null) {
                                        nm.cancel(QurbFirebaseMessagingService.CALL_NOTIFICATION_ID);
                                    }
                                } catch (Exception ignored) {}
                            } else {
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O && activeAudioFocusRequest != null) {
                                    audioManager.abandonAudioFocusRequest(activeAudioFocusRequest);
                                    activeAudioFocusRequest = null;
                                } else {
                                    audioManager.abandonAudioFocus(null);
                                }
                                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                                    audioManager.clearCommunicationDevice();
                                }
                                audioManager.setSpeakerphoneOn(false);
                                audioManager.setMode(AudioManager.MODE_NORMAL);
                            }
                        } catch (Exception ignored) {}
                    }
                });
            }
        }

        @JavascriptInterface
        public void dismissCallNotification() {
            if (activity != null) {
                activity.runOnUiThread(() -> {
                    try {
                        android.app.NotificationManager nm = (android.app.NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
                        if (nm != null) {
                            nm.cancel(QurbFirebaseMessagingService.CALL_NOTIFICATION_ID);
                        }
                    } catch (Exception ignored) {}
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
                            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                                if (on) {
                                    java.util.List<android.media.AudioDeviceInfo> devices = audioManager.getAvailableCommunicationDevices();
                                    boolean deviceSet = false;
                                    for (android.media.AudioDeviceInfo device : devices) {
                                        if (device.getType() == android.media.AudioDeviceInfo.TYPE_BUILTIN_SPEAKER) {
                                            audioManager.setCommunicationDevice(device);
                                            deviceSet = true;
                                            break;
                                        }
                                    }
                                    if (!deviceSet) {
                                        audioManager.setSpeakerphoneOn(true);
                                    }
                                } else {
                                    java.util.List<android.media.AudioDeviceInfo> devices = audioManager.getAvailableCommunicationDevices();
                                    boolean earpieceSet = false;
                                    for (android.media.AudioDeviceInfo device : devices) {
                                        if (device.getType() == android.media.AudioDeviceInfo.TYPE_BUILTIN_EARPIECE) {
                                            audioManager.setCommunicationDevice(device);
                                            earpieceSet = true;
                                            break;
                                        }
                                    }
                                    if (!earpieceSet) {
                                        audioManager.clearCommunicationDevice();
                                    }
                                    audioManager.setSpeakerphoneOn(false);
                                }
                            } else {
                                audioManager.setSpeakerphoneOn(on);
                            }
                        } catch (Exception ignored) {}
                    }
                });
            }
        }

        @JavascriptInterface
        public boolean isSpeakerphoneOn() {
            if (audioManager != null) {
                try {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                        android.media.AudioDeviceInfo commDevice = audioManager.getCommunicationDevice();
                        if (commDevice != null) {
                            return commDevice.getType() == android.media.AudioDeviceInfo.TYPE_BUILTIN_SPEAKER;
                        }
                    }
                    return audioManager.isSpeakerphoneOn();
                } catch (Exception ignored) {}
            }
            return false;
        }

        @JavascriptInterface
        public boolean hasCallPermissions(boolean withVideo) {
            if (activity == null || android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.M) {
                return true;
            }
            boolean hasAudio = activity.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) == android.content.pm.PackageManager.PERMISSION_GRANTED;
            if (!withVideo) return hasAudio;
            boolean hasCam = activity.checkSelfPermission(android.Manifest.permission.CAMERA) == android.content.pm.PackageManager.PERMISSION_GRANTED;
            return hasAudio && hasCam;
        }

        @JavascriptInterface
        public void requestCallPermissions(boolean withVideo) {
            if (activity != null && android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                activity.runOnUiThread(() -> {
                    java.util.List<String> perms = new java.util.ArrayList<>();
                    if (activity.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        perms.add(android.Manifest.permission.RECORD_AUDIO);
                    }
                    if (withVideo && activity.checkSelfPermission(android.Manifest.permission.CAMERA) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        perms.add(android.Manifest.permission.CAMERA);
                    }
                    if (!perms.isEmpty()) {
                        activity.requestPermissions(perms.toArray(new String[0]), 1002);
                    }
                });
            }
        }

        @JavascriptInterface
        public String getPendingIncomingCall() {
            String pending = MainActivity.sPendingIncomingCallPayload;
            MainActivity.sPendingIncomingCallPayload = null; // consume once
            return pending;
        }

        @JavascriptInterface
        public boolean isIgnoringBatteryOptimizations() {
            try {
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M && activity != null) {
                    android.os.PowerManager pm = (android.os.PowerManager) activity.getSystemService(Context.POWER_SERVICE);
                    if (pm != null) {
                        return pm.isIgnoringBatteryOptimizations(activity.getPackageName());
                    }
                }
            } catch (Exception ignored) {}
            return true;
        }

        @JavascriptInterface
        public void requestIgnoreBatteryOptimizations() {
            if (activity != null) {
                activity.runOnUiThread(() -> {
                    try {
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                            android.os.PowerManager pm = (android.os.PowerManager) activity.getSystemService(Context.POWER_SERVICE);
                            if (pm != null && !pm.isIgnoringBatteryOptimizations(activity.getPackageName())) {
                                Intent intent = new Intent(android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                                intent.setData(Uri.parse("package:" + activity.getPackageName()));
                                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                activity.startActivity(intent);
                            }
                        }
                    } catch (Exception ignored) {}
                });
            }
        }
    }
}
