package app.qurb.serene;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.facebook.ads.Ad;
import com.facebook.ads.AdError;
import com.facebook.ads.AudienceNetworkAds;
import com.facebook.ads.RewardedVideoAd;
import com.facebook.ads.RewardedVideoAdListener;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "MetaAdsPlugin")
public class MetaAdsPlugin extends Plugin {
    private static final String TAG = "MetaAdsPlugin";

    // User's Live Qurb Meta Rewarded Video Placement ID
    public static final String LIVE_META_REWARDED_PLACEMENT_ID = "2431468010959063_2431468194292378";

    private interface LoadFailureCallback {
        void onFailure(int errorCode, String errorMessage);
    }

    private final Object loadLock = new Object();
    private final List<Runnable> pendingSuccessCallbacks = new ArrayList<>();
    private final List<LoadFailureCallback> pendingFailureCallbacks = new ArrayList<>();

    private RewardedVideoAd rewardedVideoAd = null;
    private boolean isInitializing = false;
    private boolean isLoading = false;
    private boolean isAdLoaded = false;

    // Active playback state shared with the single RewardedVideoAdListener
    private PluginCall activeShowCall = null;
    private String activeUserId = "";
    private String activeRewardType = "likes";
    private boolean hasEarnedReward = false;

    @Override
    public void load() {
        super.load();
        initMetaAds();
    }

    private void initMetaAds() {
        if (isInitializing) return;
        isInitializing = true;

        new Thread(() -> {
            try {
                Context context = getContext();
                if (context != null) {
                    if (!AudienceNetworkAds.isInitialized(context)) {
                        AudienceNetworkAds.buildInitSettings(context)
                            .withInitListener(result -> {
                                Log.d(TAG, "Meta Audience Network initialized. Success: " + result.isSuccess() + ", Message: " + result.getMessage());
                            })
                            .initialize();
                    } else {
                        Log.d(TAG, "Meta Audience Network is already initialized.");
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Exception during Meta AudienceNetworkAds.initialize: " + e.getMessage());
            }
        }).start();
    }

    private void preloadRewardedAd(final String placementId, final Runnable onSuccess, final LoadFailureCallback onFailure) {
        synchronized (loadLock) {
            if (rewardedVideoAd != null && isAdLoaded && !rewardedVideoAd.isAdInvalidated()) {
                if (onSuccess != null) onSuccess.run();
                return;
            }
            if (onSuccess != null) pendingSuccessCallbacks.add(onSuccess);
            if (onFailure != null) pendingFailureCallbacks.add(onFailure);
            if (!isLoading) {
                isLoading = true;
                loadInternal(placementId != null && !placementId.isEmpty() ? placementId : LIVE_META_REWARDED_PLACEMENT_ID);
            }
        }
    }

    private void notifyLoadSuccess() {
        List<Runnable> callbacks;
        synchronized (loadLock) {
            isLoading = false;
            callbacks = new ArrayList<>(pendingSuccessCallbacks);
            pendingSuccessCallbacks.clear();
            pendingFailureCallbacks.clear();
        }
        for (Runnable cb : callbacks) {
            try {
                cb.run();
            } catch (Exception e) {
                Log.e(TAG, "Error in load success callback: " + e.getMessage());
            }
        }
    }

    private void notifyLoadFailure(int errorCode, String errorMessage) {
        List<LoadFailureCallback> callbacks;
        synchronized (loadLock) {
            isLoading = false;
            isAdLoaded = false;
            callbacks = new ArrayList<>(pendingFailureCallbacks);
            pendingSuccessCallbacks.clear();
            pendingFailureCallbacks.clear();
        }
        for (LoadFailureCallback cb : callbacks) {
            try {
                cb.onFailure(errorCode, errorMessage);
            } catch (Exception e) {
                Log.e(TAG, "Error in load failure callback: " + e.getMessage());
            }
        }
    }

    private void loadInternal(final String targetPlacementId) {
        final Activity activity = getActivity();
        if (activity == null) {
            notifyLoadFailure(-1, "Android Activity is unavailable");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                if (rewardedVideoAd != null) {
                    try {
                        rewardedVideoAd.destroy();
                    } catch (Exception ignored) {}
                    rewardedVideoAd = null;
                }

                isAdLoaded = false;
                rewardedVideoAd = new RewardedVideoAd(activity, targetPlacementId);

                RewardedVideoAdListener adListener = new RewardedVideoAdListener() {
                    @Override
                    public void onError(Ad ad, AdError adError) {
                        int code = adError != null ? adError.getErrorCode() : -1;
                        String msg = adError != null ? adError.getErrorMessage() : "Unknown Meta Ad error";
                        Log.w(TAG, "Meta Rewarded Ad error (" + targetPlacementId + ") [code=" + code + "]: " + msg);
                        isAdLoaded = false;

                        if (activeShowCall != null) {
                            PluginCall pendingCall = activeShowCall;
                            activeShowCall = null;
                            pendingCall.reject("Meta ad error (code " + code + "): " + msg, String.valueOf(code));
                        } else {
                            notifyLoadFailure(code, msg);
                        }
                    }

                    @Override
                    public void onAdLoaded(Ad ad) {
                        Log.d(TAG, "Meta Rewarded Video successfully loaded: " + targetPlacementId);
                        isAdLoaded = true;
                        notifyLoadSuccess();
                    }

                    @Override
                    public void onAdClicked(Ad ad) {
                        Log.d(TAG, "Meta Rewarded Video clicked.");
                    }

                    @Override
                    public void onLoggingImpression(Ad ad) {
                        Log.d(TAG, "Meta Rewarded Video impression logged.");
                    }

                    @Override
                    public void onRewardedVideoCompleted() {
                        Log.d(TAG, "Meta Rewarded Video playback completed! Rewarded = true");
                        hasEarnedReward = true;
                    }

                    @Override
                    public void onRewardedVideoClosed() {
                        Log.d(TAG, "Meta Rewarded Video closed by user. Earned: " + hasEarnedReward);
                        isAdLoaded = false;
                        boolean earned = hasEarnedReward;
                        hasEarnedReward = false;

                        try {
                            if (rewardedVideoAd != null) {
                                rewardedVideoAd.destroy();
                                rewardedVideoAd = null;
                            }
                        } catch (Exception ignored) {}

                        if (activeShowCall != null) {
                            PluginCall pendingCall = activeShowCall;
                            activeShowCall = null;
                            JSObject ret = new JSObject();
                            ret.put("rewarded", earned);
                            ret.put("userId", activeUserId);
                            ret.put("rewardType", activeRewardType);
                            pendingCall.resolve(ret);
                        }
                    }
                };

                rewardedVideoAd.loadAd(
                    rewardedVideoAd.buildLoadAdConfig()
                        .withAdListener(adListener)
                        .build()
                );
            } catch (Exception e) {
                Log.e(TAG, "Exception during Meta RewardedVideoAd.loadAd: " + e.getMessage());
                notifyLoadFailure(-1, e.getMessage() != null ? e.getMessage() : "Meta loadAd exception");
            }
        });
    }

    @PluginMethod
    public void isAdReady(PluginCall call) {
        boolean ready = rewardedVideoAd != null && isAdLoaded && !rewardedVideoAd.isAdInvalidated();
        JSObject ret = new JSObject();
        ret.put("ready", ready);
        call.resolve(ret);
    }

    @PluginMethod
    public void prepareRewardedAd(final PluginCall call) {
        String placementId = call.getString("placementId", LIVE_META_REWARDED_PLACEMENT_ID);

        if (rewardedVideoAd != null && isAdLoaded && !rewardedVideoAd.isAdInvalidated()) {
            JSObject ret = new JSObject();
            ret.put("ready", true);
            ret.put("buffered", true);
            call.resolve(ret);
            return;
        }

        preloadRewardedAd(placementId, () -> {
            JSObject ret = new JSObject();
            ret.put("ready", true);
            ret.put("buffered", true);
            call.resolve(ret);
        }, (errorCode, errorMessage) -> {
            JSObject ret = new JSObject();
            ret.put("ready", false);
            ret.put("buffered", false);
            ret.put("errorCode", errorCode);
            ret.put("errorMessage", errorMessage);
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void showRewardedAd(final PluginCall call) {
        final String userId = call.getString("userId", "");
        final String rewardType = call.getString("rewardType", "likes");
        final String placementId = call.getString("placementId", LIVE_META_REWARDED_PLACEMENT_ID);
        final Activity activity = getActivity();

        if (activity == null) {
            call.reject("Android Activity is unavailable");
            return;
        }

        if (activeShowCall != null) {
            call.reject("Another Meta rewarded ad is already active");
            return;
        }

        if (rewardedVideoAd != null && isAdLoaded && !rewardedVideoAd.isAdInvalidated()) {
            displayRewardedAd(call, userId, rewardType, activity);
        } else {
            activity.runOnUiThread(() -> Toast.makeText(getContext(), "Buffering Meta Sponsored Video...", Toast.LENGTH_SHORT).show());
            preloadRewardedAd(placementId, () -> {
                displayRewardedAd(call, userId, rewardType, activity);
            }, (errorCode, errorMessage) -> {
                call.reject("Meta Ad load failed (code " + errorCode + "): " + errorMessage, String.valueOf(errorCode));
            });
        }
    }

    private void displayRewardedAd(final PluginCall call, final String userId, final String rewardType, final Activity activity) {
        activity.runOnUiThread(() -> {
            if (rewardedVideoAd == null || !isAdLoaded || rewardedVideoAd.isAdInvalidated()) {
                call.reject("Meta Rewarded Ad instance is not loaded or invalidated");
                return;
            }

            activeShowCall = call;
            activeUserId = userId != null ? userId : "";
            activeRewardType = rewardType != null ? rewardType : "likes";
            hasEarnedReward = false;

            try {
                boolean shown = rewardedVideoAd.show();
                if (!shown) {
                    activeShowCall = null;
                    isAdLoaded = false;
                    call.reject("Meta Rewarded Video show() returned false");
                }
            } catch (Exception e) {
                activeShowCall = null;
                isAdLoaded = false;
                Log.e(TAG, "Exception showing Meta Rewarded Video: " + e.getMessage());
                call.reject("Meta failed to show: " + e.getMessage());
            }
        });
    }
}
