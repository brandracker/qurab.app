package app.qurb.serene;

import android.app.Application;
import android.os.Bundle;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.Iterator;

@CapacitorPlugin(name = "FacebookEventsPlugin")
public class FacebookEventsPlugin extends Plugin {
    private AppEventsLogger logger;

    @Override
    public void load() {
        super.load();
        try {
            if (getContext() != null) {
                FacebookSdk.sdkInitialize(getContext());
                FacebookSdk.setAutoInitEnabled(true);
                FacebookSdk.setFullySynchronized(true);
                FacebookSdk.setAutoLogAppEventsEnabled(true);
                FacebookSdk.setAdvertiserIDCollectionEnabled(true);
                if (getActivity() != null && getActivity().getApplication() != null) {
                    AppEventsLogger.activateApp(getActivity().getApplication());
                }
                logger = AppEventsLogger.newLogger(getContext());
                if (logger != null) {
                    logger.flush();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void activateApp(PluginCall call) {
        try {
            if (getActivity() != null && getActivity().getApplication() != null) {
                AppEventsLogger.activateApp(getActivity().getApplication());
            }
            if (logger == null && getContext() != null) {
                logger = AppEventsLogger.newLogger(getContext());
            }
            if (logger != null) {
                logger.flush();
            }
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to activate app: " + e.getMessage());
        }
    }

    @PluginMethod
    public void logEvent(PluginCall call) {
        String eventName = call.getString("eventName");
        if (eventName == null || eventName.isEmpty()) {
            call.reject("eventName is required");
            return;
        }

        try {
            if (logger == null && getContext() != null) {
                logger = AppEventsLogger.newLogger(getContext());
            }

            Bundle params = new Bundle();
            JSObject paramsObj = call.getObject("parameters");
            if (paramsObj != null) {
                Iterator<String> keys = paramsObj.keys();
                while (keys.hasNext()) {
                    String key = keys.next();
                    Object val = paramsObj.opt(key);
                    if (val instanceof Number) {
                        params.putDouble(key, ((Number) val).doubleValue());
                    } else if (val instanceof Boolean) {
                        params.putBoolean(key, (Boolean) val);
                    } else if (val != null) {
                        params.putString(key, val.toString());
                    }
                }
            }

            if (logger != null) {
                logger.logEvent(eventName, params);
                logger.flush();
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to log event: " + e.getMessage());
        }
    }

    @PluginMethod
    public void logPurchase(PluginCall call) {
        Double amount = call.getDouble("amount", 0.0);
        String currencyStr = call.getString("currency", "USD");

        try {
            if (logger == null && getContext() != null) {
                logger = AppEventsLogger.newLogger(getContext());
            }

            Currency currency = Currency.getInstance(currencyStr);
            Bundle params = new Bundle();
            JSObject paramsObj = call.getObject("parameters");
            if (paramsObj != null) {
                Iterator<String> keys = paramsObj.keys();
                while (keys.hasNext()) {
                    String key = keys.next();
                    Object val = paramsObj.opt(key);
                    if (val != null) {
                        params.putString(key, val.toString());
                    }
                }
            }

            if (logger != null) {
                logger.logPurchase(BigDecimal.valueOf(amount), currency, params);
                logger.flush();
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to log purchase: " + e.getMessage());
        }
    }
}
