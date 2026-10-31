# ProGuard / R8 Rules for Qurb Matrimonial App (Play Console DEX Optimization)

# Preserve source file names and line numbers for crash analysis in Play Console
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod

# 1. Capacitor Core & Plugins
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Keep JavaScript Interface methods used by Android WebView & native bridge
-keepclasseswithmembernames class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 2. Native Bridge & MainActivity
-keep class app.qurb.sereneunion.** { *; }
-keepclassmembers class app.qurb.sereneunion.MainActivity$* {
    public *;
}
-keepclassmembers class app.qurb.sereneunion.MainActivity {
    public *;
}

# 3. Google Play Billing Client 8.0
-keep class com.android.billingclient.** { *; }
-dontwarn com.android.billingclient.**

# 4. Google Mobile Ads (AdMob)
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# 5. Firebase Messaging & Google Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# 6. Facebook Android SDK
-keep class com.facebook.** { *; }
-keepclassmembers class * extends com.facebook.FacebookActivity { *; }
-dontwarn com.facebook.**

# 7. Google Play In-App Updates
-keep class com.google.android.play.core.** { *; }
-dontwarn com.google.android.play.core.**

# 8. WebRTC & Network / OkHttp
-dontwarn org.webrtc.**
-keep class org.webrtc.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
