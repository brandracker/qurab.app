package app.qurb.serene;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "AdMobPlugin")
public class AdMobPlugin extends Plugin {
    private static final String TAG = "AdMobPlugin";

    // User's Live Qurb AdMob Rewarded Ad Unit ID
    private static final String LIVE_REWARDED_AD_UNIT_ID = "ca-app-pub-5486823026870276/7539032440";
    // Google's Official Universal Sample Unit ID (for initial propagation warmup)
    private static final String SAMPLE_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

    private interface LoadFailureCallback {
        void onFailure(int errorCode, String errorMessage);
    }

    private final Object loadLock = new Object();
    private final List<Runnable> pendingSuccessCallbacks = new ArrayList<>();
    private final List<LoadFailureCallback> pendingFailureCallbacks = new ArrayList<>();

    private RewardedAd rewardedAd = null;
    private boolean isInitializing = false;
    private boolean isLoading = false;

    @Override
    public void load() {
        super.load();
        initAdMob();
    }

    private void initAdMob() {
        if (isInitializing) return;
        isInitializing = true;

        new Thread(() -> {
            try {
                Context context = getContext();
                if (context != null) {
                    MobileAds.initialize(context, initializationStatus -> {
                        Log.d(TAG, "Google AdMob MobileAds initialized successfully in background thread with App ID: ca-app-pub-5486823026870276~3052992520");
                    });
                }
            } catch (Exception e) {
                Log.e(TAG, "Exception during MobileAds.initialize: " + e.getMessage());
            }
        }).start();
    }

    private void preloadRewardedAd(final Runnable onSuccess, final LoadFailureCallback onFailure) {
        boolean shouldStartLoad = false;
        synchronized (loadLock) {
            if (rewardedAd != null) {
                if (onSuccess != null) onSuccess.run();
                return;
            }
            if (onSuccess != null) pendingSuccessCallbacks.add(onSuccess);
            if (onFailure != null) pendingFailureCallbacks.add(onFailure);
            if (!isLoading) {
                isLoading = true;
                shouldStartLoad = true;
            }
        }

        if (shouldStartLoad) {
            loadWithUnitId(LIVE_REWARDED_AD_UNIT_ID);
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

    private void loadWithUnitId(final String adUnitId) {
        final Activity activity = getActivity();
        if (activity == null) {
            notifyLoadFailure(-1, "Android Activity is unavailable");
            return;
        }

        activity.runOnUiThread(() -> {
            try {
                AdRequest adRequest = new AdRequest.Builder().build();

                RewardedAd.load(activity, adUnitId, adRequest, new RewardedAdLoadCallback() {
                    @Override
                    public void onAdLoaded(@NonNull RewardedAd ad) {
                        rewardedAd = ad;
                        Log.d(TAG, "Google AdMob Rewarded Video successfully loaded: " + adUnitId);
                        notifyLoadSuccess();
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                        rewardedAd = null;
                        int code = loadAdError.getCode();
                        String msg = loadAdError.getMessage();
                        Log.w(TAG, "Google AdMob unit failed to load (" + adUnitId + ") [code=" + code + "]: " + msg);
                        notifyLoadFailure(code, msg);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Exception during RewardedAd.load: " + e.getMessage());
                notifyLoadFailure(-1, e.getMessage() != null ? e.getMessage() : "RewardedAd.load exception");
            }
        });
    }

    @PluginMethod
    public void isAdReady(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("ready", rewardedAd != null);
        call.resolve(ret);
    }

    @PluginMethod
    public void prepareRewardedAd(final PluginCall call) {
        if (rewardedAd != null) {
            JSObject ret = new JSObject();
            ret.put("ready", true);
            ret.put("buffered", true);
            call.resolve(ret);
            return;
        }

        preloadRewardedAd(() -> {
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
        final Activity activity = getActivity();

        if (activity == null) {
            call.reject("Android Activity is unavailable");
            return;
        }

        if (rewardedAd != null) {
            displayRewardedAd(call, userId, rewardType, activity);
        } else {
            activity.runOnUiThread(() -> Toast.makeText(getContext(), "Buffering Google AdMob video...", Toast.LENGTH_SHORT).show());
            preloadRewardedAd(() -> {
                displayRewardedAd(call, userId, rewardType, activity);
            }, (errorCode, errorMessage) -> {
                call.reject("AdMob load failed (code " + errorCode + "): " + errorMessage, String.valueOf(errorCode));
            });
        }
    }

    private void displayRewardedAd(final PluginCall call, final String userId, final String rewardType, final Activity activity) {
        activity.runOnUiThread(() -> {
            if (rewardedAd == null) {
                call.reject("Rewarded ad instance is null");
                return;
            }

            final boolean[] hasEarnedReward = {false};

            rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override
                public void onAdShowedFullScreenContent() {
                    Log.d(TAG, "Google AdMob Rewarded Video showed fullscreen content.");
                }

                @Override
                public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                    Log.e(TAG, "Google AdMob failed to show: " + adError.getMessage());
                    rewardedAd = null;
                    call.reject("AdMob failed to show: " + adError.getMessage());
                }

                @Override
                public void onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Google AdMob Ad dismissed by user. Earned: " + hasEarnedReward[0]);
                    rewardedAd = null;

                    JSObject ret = new JSObject();
                    ret.put("rewarded", hasEarnedReward[0]);
                    ret.put("userId", userId);
                    ret.put("rewardType", rewardType);
                    call.resolve(ret);
                }
            });

            rewardedAd.show(activity, new OnUserEarnedRewardListener() {
                @Override
                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                    Log.d(TAG, "User completed watching AdMob video! Reward: " + rewardItem.getAmount() + " " + rewardItem.getType());
                    hasEarnedReward[0] = true;
                }
            });
        });
    }
}
