package app.qurb.serene;

import android.util.Log;
import android.widget.Toast;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

@CapacitorPlugin(name = "UnityAdsPlugin")
public class UnityAdsPlugin extends Plugin implements IUnityAdsInitializationListener {
    private static final String TAG = "UnityAdsPlugin";
    private static final String GAME_ID = "800368124";
    private static final String REWARDED_PLACEMENT_ID = "Rewarded_Android";

    // testMode must be true for debug APK builds so Unity Ads servers deliver test commercials
    // before official Google Play Store verification!
    private static final boolean TEST_MODE = true;

    private boolean isInitialized = false;
    private boolean isAdLoaded = false;

    @Override
    public void load() {
        super.load();
        initUnityAds();
    }

    private void initUnityAds() {
        if (!isInitialized) {
            UnityAds.initialize(getContext(), GAME_ID, TEST_MODE, this);
        }
    }

    @Override
    public void onInitializationComplete() {
        isInitialized = true;
        Log.d(TAG, "Unity Ads Initialization Complete! Pre-buffering rewarded ad...");
        loadRewardedAd(null);
    }

    @Override
    public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {
        Log.e(TAG, "Unity Ads Initialization Failed: " + error + " - " + message);
    }

    private void loadRewardedAd(final Runnable onLoaded) {
        loadRewardedAd(onLoaded, null);
    }

    private void loadRewardedAd(final Runnable onLoaded, final Runnable onFailed) {
        UnityAds.load(REWARDED_PLACEMENT_ID, new IUnityAdsLoadListener() {
            @Override
            public void onUnityAdsAdLoaded(String placementId) {
                isAdLoaded = true;
                Log.d(TAG, "Unity Rewarded Ad loaded successfully: " + placementId);
                if (onLoaded != null) {
                    onLoaded.run();
                }
            }

            @Override
            public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {
                isAdLoaded = false;
                Log.e(TAG, "Unity Ad Failed To Load: " + error + " - " + message);
                if (onFailed != null) {
                    onFailed.run();
                }
            }
        });
    }

    @PluginMethod
    public void showRewardedAd(final PluginCall call) {
        final String userId = call.getString("userId", "");
        final String rewardType = call.getString("rewardType", "likes");

        initUnityAds();

        if (isAdLoaded) {
            displayAd(call, userId, rewardType);
        } else {
            if (getActivity() != null) {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(getContext(), "Loading sponsor video, please wait...", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            loadRewardedAd(new Runnable() {
                @Override
                public void run() {
                    displayAd(call, userId, rewardType);
                }
            }, new Runnable() {
                @Override
                public void run() {
                    call.reject("Unity ad is still buffering. Please try again in a few moments.");
                }
            });
        }
    }

    private void displayAd(final PluginCall call, final String userId, final String rewardType) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                UnityAds.show(getActivity(), REWARDED_PLACEMENT_ID, new UnityAdsShowOptions(), new IUnityAdsShowListener() {
                    @Override
                    public void onUnityAdsShowComplete(String placementId, UnityAds.UnityAdsShowCompletionState state) {
                        Log.d(TAG, "Unity Ad Show Complete. State: " + state);
                        JSObject ret = new JSObject();
                        ret.put("rewarded", state == UnityAds.UnityAdsShowCompletionState.COMPLETED);
                        ret.put("userId", userId);
                        ret.put("rewardType", rewardType);
                        call.resolve(ret);
                        isAdLoaded = false;
                        loadRewardedAd(null);
                    }

                    @Override
                    public void onUnityAdsShowFailure(String placementId, UnityAds.UnityAdsShowError error, String message) {
                        Log.e(TAG, "Unity Ad Show Failure: " + error + " - " + message);
                        call.reject("Unity Ad show error: " + message);
                        isAdLoaded = false;
                        loadRewardedAd(null);
                    }

                    @Override
                    public void onUnityAdsShowStart(String placementId) {
                        Log.d(TAG, "Unity Fullscreen Ad Started: " + placementId);
                    }

                    @Override
                    public void onUnityAdsShowClick(String placementId) {
                        Log.d(TAG, "Unity Ad Clicked: " + placementId);
                    }
                });
            }
        });
    }

    @PluginMethod
    public void isAdReady(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("ready", isAdLoaded);
        call.resolve(ret);
    }
}
