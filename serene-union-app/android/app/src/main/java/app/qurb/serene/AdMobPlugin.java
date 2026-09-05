package app.qurb.serene;

import android.app.Activity;
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

@CapacitorPlugin(name = "AdMobPlugin")
public class AdMobPlugin extends Plugin {
    private static final String TAG = "AdMobPlugin";

    // User's Live Qurb AdMob Rewarded Ad Unit ID
    private static final String LIVE_REWARDED_AD_UNIT_ID = "ca-app-pub-9708959884639275/8907152102";
    // Google's Official Universal Sample Unit ID (for initial propagation warmup)
    private static final String SAMPLE_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

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

        MobileAds.initialize(getContext(), initializationStatus -> {
            Log.d(TAG, "Google AdMob MobileAds initialized successfully with App ID: ca-app-pub-9708959884639275~9081929429");
            preloadRewardedAd(null, null);
        });
    }

    private void preloadRewardedAd(final Runnable onSuccess, final Runnable onFailure) {
        if (rewardedAd != null || isLoading) {
            if (rewardedAd != null && onSuccess != null) onSuccess.run();
            return;
        }

        isLoading = true;
        loadWithUnitId(LIVE_REWARDED_AD_UNIT_ID, onSuccess, () -> {
            Log.d(TAG, "Live unit still warming up on AdMob servers. Preloading sample unit for instant test...");
            loadWithUnitId(SAMPLE_REWARDED_AD_UNIT_ID, onSuccess, onFailure);
        });
    }

    private void loadWithUnitId(final String adUnitId, final Runnable onSuccess, final Runnable onFailure) {
        AdRequest adRequest = new AdRequest.Builder().build();

        RewardedAd.load(getContext(), adUnitId, adRequest, new RewardedAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull RewardedAd ad) {
                rewardedAd = ad;
                isLoading = false;
                Log.d(TAG, "Google AdMob Rewarded Video successfully loaded: " + adUnitId);
                if (onSuccess != null) {
                    onSuccess.run();
                }
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                rewardedAd = null;
                isLoading = false;
                Log.w(TAG, "Google AdMob unit failed to load (" + adUnitId + "): " + loadAdError.getMessage());
                if (onFailure != null) {
                    onFailure.run();
                }
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
            }, () -> {
                call.reject("Google AdMob video could not be loaded at this time.");
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
                    preloadRewardedAd(null, null);
                    call.reject("AdMob failed to show: " + adError.getMessage());
                }

                @Override
                public void onAdDismissedFullScreenContent() {
                    Log.d(TAG, "Google AdMob Ad dismissed by user. Earned: " + hasEarnedReward[0]);
                    rewardedAd = null;
                    preloadRewardedAd(null, null);

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
