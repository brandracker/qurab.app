package app.qurb.serene;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "GooglePlayBillingPlugin")
public class GooglePlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    private static final String TAG = "GooglePlayBilling";

    private BillingClient billingClient;
    private boolean isClientReady = false;
    private PluginCall activePurchaseCall = null;
    private final Map<String, ProductDetails> cachedProductDetails = new HashMap<>();

    @Override
    public void load() {
        super.load();
        initBillingClient();
    }

    private void initBillingClient() {
        PendingPurchasesParams pendingPurchasesParams = PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build();

        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(pendingPurchasesParams)
                .build();

        connectToGooglePlay(null);
    }

    private void connectToGooglePlay(@Nullable final Runnable onConnected) {
        if (billingClient == null) return;

        try {
            billingClient.startConnection(new BillingClientStateListener() {
                @Override
                public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        Log.d(TAG, "Google Play BillingClient successfully connected!");
                        isClientReady = true;
                        if (onConnected != null) onConnected.run();
                    } else {
                        Log.w(TAG, "Billing setup response: " + billingResult.getDebugMessage());
                        isClientReady = false;
                    }
                }

                @Override
                public void onBillingServiceDisconnected() {
                    Log.w(TAG, "BillingClient disconnected. Will reconnect on next call.");
                    isClientReady = false;
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error connecting to Google Play Billing: " + e.getMessage());
            isClientReady = false;
        }
    }

    @PluginMethod
    public void isBillingSupported(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("ready", isClientReady);
        call.resolve(ret);
    }

    @PluginMethod
    public void launchBillingFlow(PluginCall call) {
        String productId = call.getString("productId");
        String productTypeStr = call.getString("productType", "inapp");
        String userId = call.getString("userId", "");
        boolean preferTrial = call.getBoolean("preferTrial", true);

        if (productId == null || productId.isEmpty()) {
            call.reject("Product ID is required");
            return;
        }

        activePurchaseCall = call;

        Runnable action = () -> executeLaunch(productId, productTypeStr, userId, preferTrial);

        if (!isClientReady) {
            connectToGooglePlay(action);
        } else {
            action.run();
        }
    }

    private void executeLaunch(String productId, String productTypeStr, String userId, boolean preferTrial) {
        final String productType = "subs".equalsIgnoreCase(productTypeStr)
                ? BillingClient.ProductType.SUBS
                : BillingClient.ProductType.INAPP;

        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(
                QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(productType)
                        .build()
        );

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();

        billingClient.queryProductDetailsAsync(params, (billingResult, queryProductDetailsResult) -> {
            List<ProductDetails> queryProductDetailsList = queryProductDetailsResult != null ? queryProductDetailsResult.getProductDetailsList() : null;
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK || queryProductDetailsList == null || queryProductDetailsList.isEmpty()) {
                Log.e(TAG, "Failed to find product in Google Play: " + billingResult.getDebugMessage());
                if (activePurchaseCall != null) {
                    activePurchaseCall.reject("Product not found on Google Play: " + productId);
                    activePurchaseCall = null;
                }
                return;
            }

            ProductDetails productDetails = queryProductDetailsList.get(0);
            cachedProductDetails.put(productId, productDetails);

            BillingFlowParams.ProductDetailsParams.Builder productDetailsParamsBuilder =
                    BillingFlowParams.ProductDetailsParams.newBuilder()
                            .setProductDetails(productDetails);

            if (BillingClient.ProductType.SUBS.equals(productType)) {
                List<ProductDetails.SubscriptionOfferDetails> offerDetails = productDetails.getSubscriptionOfferDetails();
                if (offerDetails != null && !offerDetails.isEmpty()) {
                    String selectedOfferToken = null;
                    if (preferTrial) {
                        for (ProductDetails.SubscriptionOfferDetails offer : offerDetails) {
                            if (offer.getPricingPhases() != null) {
                                for (ProductDetails.PricingPhase phase : offer.getPricingPhases().getPricingPhaseList()) {
                                    if (phase.getPriceAmountMicros() == 0) {
                                        selectedOfferToken = offer.getOfferToken();
                                        Log.d(TAG, "Selected 7-Day Free Trial offer token: " + selectedOfferToken);
                                        break;
                                    }
                                }
                            }
                            if (selectedOfferToken != null) break;
                        }
                    }
                    if (selectedOfferToken == null) {
                        selectedOfferToken = offerDetails.get(0).getOfferToken();
                    }
                    productDetailsParamsBuilder.setOfferToken(selectedOfferToken);
                }
            }

            List<BillingFlowParams.ProductDetailsParams> list = new ArrayList<>();
            list.add(productDetailsParamsBuilder.build());

            BillingFlowParams.Builder flowParamsBuilder = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(list);

            if (userId != null && !userId.isEmpty()) {
                flowParamsBuilder.setObfuscatedAccountId(userId);
            }

            BillingFlowParams flowParams = flowParamsBuilder.build();

            final android.app.Activity activity = getActivity();
            if (activity == null) {
                if (activePurchaseCall != null) {
                    activePurchaseCall.reject("Android Activity is unavailable");
                    activePurchaseCall = null;
                }
                return;
            }

            activity.runOnUiThread(() -> {
                try {
                    BillingResult result = billingClient.launchBillingFlow(activity, flowParams);
                    if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        Log.e(TAG, "Launch billing flow error: " + result.getDebugMessage());
                        if (result.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
                            Log.d(TAG, "Product already owned, attempting to recover active purchase...");
                            resolveAlreadyOwned(productId);
                        } else if (activePurchaseCall != null) {
                            activePurchaseCall.reject("Unable to open Google Play payment: " + result.getDebugMessage());
                            activePurchaseCall = null;
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Exception during launchBillingFlow: " + e.getMessage());
                    if (activePurchaseCall != null) {
                        activePurchaseCall.reject("Exception launching Google Play billing: " + e.getMessage());
                        activePurchaseCall = null;
                    }
                }
            });
        });
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                handlePurchaseSuccess(purchase);
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            if (activePurchaseCall != null) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("userCancelled", true);
                activePurchaseCall.resolve(ret);
                activePurchaseCall = null;
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
            Log.d(TAG, "onPurchasesUpdated ITEM_ALREADY_OWNED, resolving active subscription...");
            resolveAlreadyOwned(null);
        } else {
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Google Play error: " + billingResult.getDebugMessage());
                activePurchaseCall = null;
            }
        }
    }

    private void resolveAlreadyOwned(@Nullable String targetProductId) {
        if (billingClient == null) return;
        try {
            QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                    .setProductType(BillingClient.ProductType.SUBS)
                    .build();
            billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null && !purchases.isEmpty()) {
                    Purchase matched = null;
                    if (targetProductId != null && !targetProductId.isEmpty()) {
                        for (Purchase p : purchases) {
                            if (p.getProducts().contains(targetProductId)) {
                                matched = p;
                                break;
                            }
                        }
                    }
                    if (matched == null) matched = purchases.get(0);
                    Log.d(TAG, "Successfully resolved already owned subscription: " + matched.getPurchaseToken());
                    handlePurchaseSuccess(matched);
                } else {
                    if (activePurchaseCall != null) {
                        JSObject ret = new JSObject();
                        ret.put("success", false);
                        ret.put("alreadyOwned", true);
                        ret.put("message", "This Google Play account already owns this subscription.");
                        activePurchaseCall.resolve(ret);
                        activePurchaseCall = null;
                    }
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error in resolveAlreadyOwned: " + e.getMessage());
            if (activePurchaseCall != null) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("alreadyOwned", true);
                activePurchaseCall.resolve(ret);
                activePurchaseCall = null;
            }
        }
    }

    @PluginMethod
    public void restorePurchases(PluginCall call) {
        if (billingClient == null) {
            call.reject("Google Play Billing client is not initialized");
            return;
        }

        Runnable action = () -> {
            try {
                QueryPurchasesParams params = QueryPurchasesParams.newBuilder()
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build();

                billingClient.queryPurchasesAsync(params, (billingResult, purchases) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null && !purchases.isEmpty()) {
                        Purchase p = purchases.get(0);
                        String productId = p.getProducts().isEmpty() ? "qurb_barakah_monthly" : p.getProducts().get(0);
                        String orderId = p.getOrderId();
                        if (orderId == null || orderId.trim().isEmpty()) {
                            orderId = "GPA.SUB-" + p.getPurchaseTime();
                        }
                        JSObject ret = new JSObject();
                        ret.put("hasActiveSubscription", true);
                        ret.put("purchaseToken", p.getPurchaseToken());
                        ret.put("orderId", orderId);
                        ret.put("productId", productId);
                        call.resolve(ret);
                    } else {
                        JSObject ret = new JSObject();
                        ret.put("hasActiveSubscription", false);
                        call.resolve(ret);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Error in restorePurchases: " + e.getMessage());
                call.reject("Error querying purchases: " + e.getMessage());
            }
        };

        if (!isClientReady) {
            connectToGooglePlay(action);
        } else {
            action.run();
        }
    }

    private void handlePurchaseSuccess(Purchase purchase) {
        if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) return;

        String productId = purchase.getProducts().isEmpty() ? "" : purchase.getProducts().get(0);
        String orderId = purchase.getOrderId();
        if (orderId == null || orderId.trim().isEmpty()) {
            orderId = "GPA.SUB-" + purchase.getPurchaseTime();
        }

        // Acknowledge non-consumable subscriptions immediately
        if (!purchase.isAcknowledged()) {
            AcknowledgePurchaseParams ackParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.getPurchaseToken())
                    .build();
            billingClient.acknowledgePurchase(ackParams, billingResult -> {
                Log.d(TAG, "Purchase acknowledged: " + billingResult.getResponseCode());
            });
        }

        // Consume one-time consumable products (Direct Salams, Boosts) so they can be bought again
        if (!productId.contains("monthly")) {
            ConsumeParams consumeParams = ConsumeParams.newBuilder()
                    .setPurchaseToken(purchase.getPurchaseToken())
                    .build();
            billingClient.consumeAsync(consumeParams, (billingResult, s) -> {
                Log.d(TAG, "Purchase consumed: " + billingResult.getResponseCode());
            });
        }

        if (activePurchaseCall != null) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            ret.put("orderId", orderId);
            ret.put("purchaseToken", purchase.getPurchaseToken());
            ret.put("productId", productId);
            ret.put("purchaseTime", purchase.getPurchaseTime());
            activePurchaseCall.resolve(ret);
            activePurchaseCall = null;
        }

        // Broadcast to JavaScript listeners
        JSObject event = new JSObject();
        event.put("productId", productId);
        event.put("orderId", orderId);
        event.put("purchaseToken", purchase.getPurchaseToken());
        notifyListeners("onPurchaseCompleted", event);
    }
}
