package app.qurb.serene;

import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "GoogleAuthPlugin")
public class GoogleAuthPlugin extends Plugin {
    private static final String TAG = "GoogleAuthPlugin";
    private static final String WEB_CLIENT_ID = "865198689748-utp5e8o5g1445ja1hvnovot1l888vuhg.apps.googleusercontent.com";

    private GoogleSignInClient googleSignInClient;

    @Override
    public void load() {
        super.load();
        initGoogleClient();
    }

    private void initGoogleClient() {
        try {
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(WEB_CLIENT_ID)
                    .requestEmail()
                    .requestProfile()
                    .build();
            googleSignInClient = GoogleSignIn.getClient(getActivity(), gso);
            Log.d(TAG, "GoogleSignInClient initialized successfully with client ID: " + WEB_CLIENT_ID);
        } catch (Exception e) {
            Log.e(TAG, "Error initializing GoogleSignInClient: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void signIn(PluginCall call) {
        if (googleSignInClient == null) {
            initGoogleClient();
        }

        if (googleSignInClient == null) {
            call.reject("Google Play Services Sign-In client unavailable");
            return;
        }

        try {
            Intent signInIntent = googleSignInClient.getSignInIntent();
            startActivityForResult(call, signInIntent, "handleGoogleSignInResult");
        } catch (Exception e) {
            Log.e(TAG, "Failed to launch Google Sign-In intent: " + e.getMessage(), e);
            call.reject("Could not launch Google Sign-In: " + e.getMessage());
        }
    }

    @ActivityCallback
    private void handleGoogleSignInResult(PluginCall call, ActivityResult result) {
        if (call == null) return;

        try {
            Intent data = result.getData();
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            GoogleSignInAccount account = task.getResult(ApiException.class);

            if (account != null) {
                JSObject ret = new JSObject();
                ret.put("idToken", account.getIdToken() != null ? account.getIdToken() : "");
                ret.put("email", account.getEmail() != null ? account.getEmail() : "");
                ret.put("displayName", account.getDisplayName() != null ? account.getDisplayName() : "");
                ret.put("photoUrl", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : "");
                ret.put("id", account.getId() != null ? account.getId() : "");
                call.resolve(ret);
            } else {
                call.reject("Google account details were null");
            }
        } catch (ApiException e) {
            Log.e(TAG, "Google Sign-In failed with status code: " + e.getStatusCode() + " - " + e.getMessage());
            call.reject("Google Sign-In failed: " + e.getStatusCode(), String.valueOf(e.getStatusCode()));
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in Google Sign-In: " + e.getMessage(), e);
            call.reject("Google Sign-In error: " + e.getMessage());
        }
    }

    @PluginMethod
    public void signOut(PluginCall call) {
        if (googleSignInClient != null) {
            googleSignInClient.signOut().addOnCompleteListener(task -> {
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            });
        } else {
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        }
    }
}
