package app.qurb.serene;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "AppUpdatePlugin")
public class AppUpdatePlugin extends Plugin {
    private static final String TAG = "AppUpdatePlugin";
    private static final int RC_APP_UPDATE = 9001;

    private AppUpdateManager appUpdateManager;
    private AppUpdateInfo cachedAppUpdateInfo;
    private PluginCall savedUpdateCall;
    private InstallStateUpdatedListener installStateUpdatedListener;

    @Override
    public void load() {
        super.load();
        try {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
            registerInstallStateListener();
        } catch (Exception e) {
            Log.e(TAG, "Error initializing AppUpdateManager: " + e.getMessage());
        }
    }

    private void registerInstallStateListener() {
        if (appUpdateManager == null) return;
        installStateUpdatedListener = new InstallStateUpdatedListener() {
            @Override
            public void onStateUpdate(@NonNull InstallState state) {
                if (state.installStatus() == InstallStatus.DOWNLOADED) {
                    Log.d(TAG, "Flexible update downloaded. Ready to complete.");
                    JSObject ret = new JSObject();
                    ret.put("status", "DOWNLOADED");
                    notifyListeners("onFlexibleUpdateDownloaded", ret);
                }
            }
        };
        appUpdateManager.registerListener(installStateUpdatedListener);
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            try {
                appUpdateManager.unregisterListener(installStateUpdatedListener);
            } catch (Exception ignored) {}
        }
    }

    @PluginMethod
    public void checkAppUpdate(final PluginCall call) {
        if (appUpdateManager == null) {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
        }

        Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
        appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
            cachedAppUpdateInfo = appUpdateInfo;
            int availability = appUpdateInfo.updateAvailability();
            int availableVersionCode = appUpdateInfo.availableVersionCode();
            boolean isImmediateAllowed = appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE);
            boolean isFlexibleAllowed = appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE);

            JSObject ret = new JSObject();
            ret.put("updateAvailability", availability);
            ret.put("isUpdateAvailable", availability == UpdateAvailability.UPDATE_AVAILABLE || availability == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS);
            ret.put("availableVersionCode", availableVersionCode);
            ret.put("isImmediateAllowed", isImmediateAllowed);
            ret.put("isFlexibleAllowed", isFlexibleAllowed);
            ret.put("installStatus", appUpdateInfo.installStatus());
            call.resolve(ret);
        }).addOnFailureListener(e -> {
            Log.w(TAG, "Failed to check Google Play in-app update: " + e.getMessage());
            JSObject ret = new JSObject();
            ret.put("updateAvailability", 0);
            ret.put("isUpdateAvailable", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void startImmediateUpdate(final PluginCall call) {
        final Activity activity = getActivity();
        if (activity == null) {
            call.reject("Android Activity is unavailable");
            return;
        }

        if (appUpdateManager == null) {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
        }

        if (cachedAppUpdateInfo != null && cachedAppUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
            triggerImmediateFlow(cachedAppUpdateInfo, activity, call);
        } else {
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(info -> {
                cachedAppUpdateInfo = info;
                if (info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    triggerImmediateFlow(info, activity, call);
                } else {
                    call.reject("Immediate update not allowed for current build state");
                }
            }).addOnFailureListener(e -> call.reject("Failed to fetch update info: " + e.getMessage()));
        }
    }

    private void triggerImmediateFlow(AppUpdateInfo info, Activity activity, PluginCall call) {
        try {
            savedUpdateCall = call;
            appUpdateManager.startUpdateFlowForResult(info, AppUpdateType.IMMEDIATE, activity, RC_APP_UPDATE);
        } catch (Exception e) {
            Log.e(TAG, "Exception starting immediate update: " + e.getMessage());
            call.reject("Exception starting update: " + e.getMessage());
        }
    }

    @PluginMethod
    public void completeFlexibleUpdate(final PluginCall call) {
        if (appUpdateManager == null) {
            call.reject("AppUpdateManager is null");
            return;
        }
        appUpdateManager.completeUpdate().addOnSuccessListener(aVoid -> {
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        }).addOnFailureListener(e -> call.reject("Failed to complete update: " + e.getMessage()));
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        if (requestCode == RC_APP_UPDATE) {
            if (savedUpdateCall != null) {
                JSObject ret = new JSObject();
                ret.put("resultCode", resultCode);
                ret.put("success", resultCode == Activity.RESULT_OK);
                ret.put("canceled", resultCode == Activity.RESULT_CANCELED);
                savedUpdateCall.resolve(ret);
                savedUpdateCall = null;
            }
        }
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (appUpdateManager == null) return;
        appUpdateManager.getAppUpdateInfo().addOnSuccessListener(info -> {
            if (info.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                Activity activity = getActivity();
                if (activity != null && info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    try {
                        appUpdateManager.startUpdateFlowForResult(info, AppUpdateType.IMMEDIATE, activity, RC_APP_UPDATE);
                    } catch (Exception ignored) {}
                }
            } else if (info.installStatus() == InstallStatus.DOWNLOADED) {
                JSObject ret = new JSObject();
                ret.put("status", "DOWNLOADED");
                notifyListeners("onFlexibleUpdateDownloaded", ret);
            }
        });
    }
}
