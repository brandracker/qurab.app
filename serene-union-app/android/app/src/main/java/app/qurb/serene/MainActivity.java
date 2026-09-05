package app.qurb.serene;

import android.os.Bundle;
import android.webkit.JavascriptInterface;

import com.getcapacitor.BridgeActivity;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

public class MainActivity extends BridgeActivity {
    private static final String GAME_ID = "800368124";
    private static final String REWARDED_PLACEMENT_ID = "Rewarded_Android";
    private static final boolean TEST_MODE = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize Unity Ads SDK with live credentials
        UnityAds.initialize(getApplicationContext(), GAME_ID, TEST_MODE, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {
                loadRewardedAd();
            }

            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
            }
        });

        // Add Javascript Bridge for WebView to trigger Unity Ads
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().addJavascriptInterface(new UnityAdsBridge(), "AndroidUnityAds");
        }
    }

    private void loadRewardedAd() {
        UnityAds.load(REWARDED_PLACEMENT_ID, new IUnityAdsLoadListener() {
            @Override
            public void onComplete(String placementId) {}

            @Override
            public void onFailed(String placementId, UnityAds.UnityAdsLoadError error, String message) {}
        });
    }

    public class UnityAdsBridge {
        @JavascriptInterface
        public void showRewardedAd(final String userId, final String rewardType) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    UnityAds.show(MainActivity.this, REWARDED_PLACEMENT_ID, new UnityAdsShowOptions(), new IUnityAdsShowListener() {
                        @Override
                        public void onComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                            if (state == UnityAds.UnityAdsShowCompletionState.COMPLETED) {
                                notifyRewardClaimed(userId, rewardType);
                            }
                            loadRewardedAd();
                        }

                        @Override
                        public void onFailed(String placementId, UnityAds.UnityAdsShowError error, String message) {
                            loadRewardedAd();
                        }

                        @Override
                        public void onStart(String placementId) {}

                        @Override
                        public void onClick(String placementId) {}
                    });
                }
            });
        }
    }

    private void notifyRewardClaimed(final String userId, final String rewardType) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('unity_ad_completed', { detail: { userId: '" + userId + "', rewardType: '" + rewardType + "' } }));",
                        null
                    );
                }
            }
        });
    }
}
