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

        if (productId == null || productId.isEmpty()) {
            call.reject("Product ID is required");
            return;
        }

        activePurchaseCall = call;

        Runnable action = () -> executeLaunch(productId, productTypeStr);

        if (!isClientReady) {
            connectToGooglePlay(action);
        } else {
            action.run();
        }
    }

    private void executeLaunch(String productId, String productTypeStr) {
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
                    productDetailsParamsBuilder.setOfferToken(offerDetails.get(0).getOfferToken());
                }
            }

            List<BillingFlowParams.ProductDetailsParams> list = new ArrayList<>();
            list.add(productDetailsParamsBuilder.build());

            BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(list)
                    .build();

            getActivity().runOnUiThread(() -> {
                BillingResult result = billingClient.launchBillingFlow(getActivity(), flowParams);
                if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                    Log.e(TAG, "Launch billing flow error: " + result.getDebugMessage());
                    if (activePurchaseCall != null) {
                        activePurchaseCall.reject("Unable to open Google Play payment: " + result.getDebugMessage());
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
        } else {
            if (activePurchaseCall != null) {
                activePurchaseCall.reject("Google Play error: " + billingResult.getDebugMessage());
                activePurchaseCall = null;
            }
        }
    }

    private void handlePurchaseSuccess(Purchase purchase) {
        if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) return;

        String productId = purchase.getProducts().isEmpty() ? "" : purchase.getProducts().get(0);

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
            ret.put("orderId", purchase.getOrderId());
            ret.put("purchaseToken", purchase.getPurchaseToken());
            ret.put("productId", productId);
            ret.put("purchaseTime", purchase.getPurchaseTime());
            activePurchaseCall.resolve(ret);
            activePurchaseCall = null;
        }

        // Broadcast to JavaScript listeners
        JSObject event = new JSObject();
        event.put("productId", productId);
        event.put("orderId", purchase.getOrderId());
        event.put("purchaseToken", purchase.getPurchaseToken());
        notifyListeners("onPurchaseCompleted", event);
    }
}
