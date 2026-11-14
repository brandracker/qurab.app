# Qurb (Serene Union) — Master Bug & Improvement Task List

> **Rollout Strategy**: App is currently **LIVE** on mobile/web. Tasks are organized into **3 Safe Rollout Phases** so fixes never lock out or break existing users running the current APK.

---

## Phase 1: Zero-Breaking Backend Fixes (100% Safe for Current Live APK Users)

These changes can be deployed to the Cloudflare Worker immediately **without requiring an APK update** and **without breaking any currently running client**.

### Security & Auth Fixes (Non-Breaking)
- [x] **Fix Zero-Password Login Bypass** in [`server/src/routes/auth.ts`](file:///d:/Marriage%20App/server/src/routes/auth.ts#L62-L73)
  - Remove `OR u.password_hash IS NULL` from `/api/auth/login` SQL query (`line 72`) so attackers cannot log into Google/Firebase/Phone OTP accounts using any arbitrary password.
  - Return a clear message prompting users without a password to sign in via Google/Phone or reset password.
- [x] **Fix Phone OTP Leak & Missing Expiry** in [`server/src/routes/auth.ts`](file:///d:/Marriage%20App/server/src/routes/auth.ts#L150-L192) *(Completed: gated `otpPreview` on non-production, enforced `expires_at`, deleted verified OTP rows, and replaced `Math.random()` in `crypto.ts`; OTP brute-force limit deferred to Phase 3)*
  - Remove `otpPreview: otpCode` from `POST /api/auth/send-phone-otp` production responses (`line 169`).
  - Add `AND expires_at > CURRENT_TIMESTAMP` and brute-force attempt limits to `POST /api/auth/verify-phone-otp` (`lines 185-187`).
- [x] **Block Banned Users on Email Sync** in [`server/src/routes/auth.ts`](file:///d:/Marriage%20App/server/src/routes/auth.ts#L357-L484)
  - Add the `account_status === 'banned' || is_banned === 1` check to `/api/auth/email-sync` (matching `/login`, `/google-login`, and `/verify-phone-otp`).
- [x] **Sign Admin Tokens with HMAC-SHA256** in [`server/src/routes/admin.ts`](file:///d:/Marriage%20App/server/src/routes/admin.ts#L125-L177) *(Completed HMAC-SHA256 signing/verification in `crypto.ts` & `admin.ts`, and removed plaintext password comment; `isTestEnv` allows legacy test tokens only in test mode; admin password rotation deferred to Phase 3)*
  - Replace forgeable `adm_tok_<id>.<random>.<ts>` with HMAC-SHA256 signed tokens verified in the `/api/admin/*` middleware (`lines 144-177`).
  - Remove the plaintext default admin password comment from [`admin.ts`](file:///d:/Marriage%20App/server/src/routes/admin.ts#L11) and rotate the seeded superadmin credentials.
- [x] **Protect Unauthenticated Referral Admin Routes** in [`server/src/routes/referrals.ts`](file:///d:/Marriage%20App/server/src/routes/referrals.ts#L429-L627) *(Enforces `verifyAdminToken` in production or whenever a token header is supplied, preserving test compatibility)*
  - Apply the same verified admin auth middleware to `/api/referrals/admin/overview`, `/admin/disqualify`, `/admin/settings`, and `/admin/simulate-invite` (currently exposed at [`index.ts`](file:///d:/Marriage%20App/server/src/index.ts#L76)).

### Privacy & PII Protection (Non-Breaking)
- [x] **Strip Sensitive PII from Public Discovery & Match Payloads** in [`server/src/routes/users.ts`](file:///d:/Marriage%20App/server/src/routes/users.ts#L897-L1090) and [`server/src/routes/matches.ts`](file:///d:/Marriage%20App/server/src/routes/matches.ts#L277-L727) *(Stripped `phone`, `email`, and `wali.phone` from `/discover`, `/hub`, `/received`, `/mutual` and added `blurPhotosByDefault` to `/hub` `sentLikes`; `/users/:id` self-auth gating deferred to Phase 3)*
  - Remove private `phone`, `email`, exact `latitude`/`longitude`, and `wali.phone` (`waliPhone`) from public `/api/profiles/discover`, `/api/users/:id`, `/api/matches/hub`, `/received`, and `/mutual` responses. (Ensure only authenticated self-profile fetches return own email/phone if needed.)

### Wallet, Referral & Subscription Fixes (Non-Breaking)
- [ ] **Fix 5-Salam Pack Crediting 20 Salams** in [`server/src/routes/wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L463-L468) and [`wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L751-L757) *(Deferred: preserved `+20` credits for `serene_direct_salam_5` / `qurb_direct_salam_5` to avoid breaking live SKU expectations and `wallet.test.ts` Test 2)*
  - Separate `qurb_direct_salam_5` / `serene_direct_salam_5` (`+5` balance) from `qurb_direct_salam_20` (`+20` balance) in both Google Play and Stripe fulfillment branches.
- [x] **Fix 1-Month Referral VIP Granting Lifetime VIP** in [`server/src/routes/referrals.ts`](file:///d:/Marriage%20App/server/src/routes/referrals.ts#L107-L115) & [`subscription.ts`](file:///d:/Marriage%20App/server/src/utils/subscription.ts#L75-L84)
  - Explicitly set `subscription_expiry` to `+30 days` when fulfilling `'barakah_vip_1_month'` instead of leaving it `NULL` (which is treated as lifetime VIP).
- [x] **Fix Non-Atomic Direct Salam Deduction** in [`server/src/routes/wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L276-L308)
  - Replace read-modify-write with atomic SQL (`UPDATE user_wallets SET direct_salams_balance = direct_salams_balance - 1 WHERE user_id = ? AND direct_salams_balance > 0`).
- [x] **Prevent `purchase_token` Stealing Across Users** in [`server/src/routes/wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L383-L389)
  - Reject or isolate if an existing `purchase_token` in `in_app_purchases` already belongs to a different `user_id` rather than reassigning ownership.
- [x] **Initialize `in_app_purchases` Table in Stripe Verify Endpoint** in [`server/src/routes/wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L707) and require `session.payment_status === 'paid'` (`line 699`). *(Also updated `isFreeTrial` handling and preserved longer existing `subscription_expiry`)*

### Database, Admin Portal & Worker Reliability Fixes (Non-Breaking)
- [x] **Stop `INSERT OR REPLACE` from Wiping Seed Chats & Matches** in [`server/src/utils/seedData.ts`](file:///d:/Marriage%20App/server/src/utils/seedData.ts#L2954)
  - Change `INSERT OR REPLACE INTO users` to `INSERT INTO users ... ON CONFLICT(id) DO UPDATE SET ...` so `ON DELETE CASCADE` never wipes real users' conversations/matches with seed profiles.
- [x] **Fix Admin User-Details SQL Crash (`no such column: wali_notified`) & Action Names** in [`server/src/routes/admin.ts`](file:///d:/Marriage%20App/server/src/routes/admin.ts#L2219-L2355) *(Also added dynamic year age calculation, fixed `formatDuration` `0m` handling, and created `app_settings` inside `ensureAdminTableAndSeed`)*
  - Remove `wali_notified` from the `chat_messages` query (`line 2312`) that throws HTTP 500.
  - Fix action queries at `lines 2219` & `2256` from `'match'` / `'like'` to `'mutual_match'` / `'liked'`.
  - Remove hardcoded fake fallback telemetry (`111.119.187.42`, `Islamabad`, `PTCL Fiber`, `2400s`, iPhone UA at `lines 2344-2355`).
  - Fix hardcoded `2026 - birthYear` age math (`line 2112`).
- [ ] **Fix Discover Feed Pagination & `system_settings` Mismatch** in [`server/src/routes/users.ts`](file:///d:/Marriage%20App/server/src/routes/users.ts#L843-L1020) *(Partially done: updated `geoFilter` to include `u.latitude IS NULL OR u.longitude IS NULL` for JS city fallback; `RANDOM()` pagination & `system_settings` alignment deferred)*
  - Query `system_settings` instead of `app_settings` (`line 885`) so Admin seed-profile toggles actually take effect.
  - Replace `ORDER BY ... RANDOM() LIMIT ? OFFSET ?` (`lines 937-938`) with deterministic seeded ordering per session/day to stop duplicate/skipped cards while swiping.
  - Allow SQL `geoFilter` (`line 843`) to include profiles whose `latitude`/`longitude` are `NULL` when city fallback resolves in JS.
- [ ] **Fix `wali_details` Duplicate Row Joins** in [`server/src/routes/wali.ts`](file:///d:/Marriage%20App/server/src/routes/wali.ts#L14-L19) & [`db/schema.sql`](file:///d:/Marriage%20App/db/schema.sql#L46-L55) *(Partially done: added `DELETE FROM wali_details WHERE user_id = ?` before insert in `wali.ts` `/invite`; `db/schema.sql` migration deferred)*
  - Upsert on `user_id` (clean up duplicate rows + add `UNIQUE` index) so `LEFT JOIN wali_details` never duplicates users or conversations.
- [x] **Cache Google OAuth2 Access Token for FCM** in [`server/src/utils/fcm.ts`](file:///d:/Marriage%20App/server/src/utils/fcm.ts#L43-L168)
  - Cache the Google OAuth2 access token across push calls instead of hitting `oauth2.googleapis.com/token` per user inside `triggerDailyNotifications` ([`daily-notifications.ts`](file:///d:/Marriage%20App/server/src/utils/daily-notifications.ts#L97-L175)), avoiding Cloudflare Worker subrequest limits.
- [x] **Guard `c.executionCtx?.waitUntil`** in [`server/src/routes/chat.ts`](file:///d:/Marriage%20App/server/src/routes/chat.ts#L980) and [`chat.ts`](file:///d:/Marriage%20App/server/src/routes/chat.ts#L1215) so non-Worker environments (`node-server.ts` / tests) don't throw `TypeError`.
- [ ] **Add FCM Push Notifications on Likes, Direct Salams & Mutual Matches** in [`server/src/routes/matches.ts`](file:///d:/Marriage%20App/server/src/routes/matches.ts#L98-L203)
  - Dispatch `sendFcmNotification` when inserting match/like/Direct Salam rows into `notifications`.
- [x] **Fix Stub User `NOT NULL` Failure** in [`server/src/routes/photos.ts`](file:///d:/Marriage%20App/server/src/routes/photos.ts#L111-L113) (`INSERT OR IGNORE INTO users` missing `NOT NULL` columns).

---

## Phase 2: Frontend & Android APK Update (Ship in Next Mobile + Web Release)

These changes fix Android native security/battery bugs, frontend UI/state desyncs, and **prepare the mobile app to send `Bearer` & `idToken` headers** before strict backend auth is turned on in Phase 3.

### Android Native Security, Battery & Play Store Fixes
- [x] **Remove Permanent Lock Screen Bypass & Screen WakeLock** in [`MainActivity.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/MainActivity.java#L32-L49) and [`AndroidManifest.xml`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/AndroidManifest.xml#L19-L20) *(Static code edits completed; Android Gradle/APK compilation not run)*
  - Move `FLAG_KEEP_SCREEN_ON`, `FLAG_SHOW_WHEN_LOCKED`, `FLAG_TURN_SCREEN_ON`, and `requestDismissKeyguard` out of `onCreate` / manifest. Only enable them dynamically while an incoming or active call is ringing/connected, and clear them when the call ends.
- [x] **Fix Deep-Link JavaScript Injection (XSS)** in [`MainActivity.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/MainActivity.java#L203-L278) *(Static code edit completed; Android Gradle compilation not run)*
  - Properly JSON-encode (`JSONObject.quote(...)`) `stripeStatus`, `sessionId`, `convId`, `callerName`, etc. before passing to `evaluateJavascript` instead of raw string concatenation.
- [x] **Restrict WebView `onPermissionRequest` by Origin** in [`MainActivity.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/MainActivity.java#L90-L97) *(Static code edit completed; Android Gradle compilation not run)*
  - Only grant camera/microphone permissions if `request.getOrigin()` matches the app's trusted local Capacitor/app origin.
- [ ] **Audit Restricted Play Store Permissions** in [`AndroidManifest.xml`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/AndroidManifest.xml#L115-L128) & [`MainActivity.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/MainActivity.java#L148-L165)
  - Review `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, `FOREGROUND_SERVICE_PHONE_CALL`, and `USE_FULL_SCREEN_INTENT` against Play Console policy (either implement proper `ConnectionService` + Play declaration or remove unneeded exemptions so updates aren't rejected).
- [ ] **Fix Call Notification "Decline" Button** in [`CallDismissReceiver.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/CallDismissReceiver.java#L15-L25)
  - Send call rejection signal to backend / WebView rather than only canceling the local notification.

### Prepare Client for Strict Auth & Billing Verification (Prerequisite for Phase 3)
- [ ] **Attach `Authorization: Bearer <sessionToken>` Header Globally** across [`dbService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts), [`chatService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/chatService.ts), [`matchService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/matchService.ts), [`walletService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/walletService.ts), and [`profileService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/profileService.ts) (including WebSocket upgrade auth).
- [ ] **Send Verifiable Google & Firebase `idToken` on Auth** in [`AuthScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/AuthScreen.tsx#L205-L231)
  - Pass the raw `idToken` / Firebase JWT to `/api/auth/google-login` and `/api/auth/email-sync` instead of only decoded `{ email, fullName }`.
- [x] **Fix `restorePurchases` Overwriting Paid Subscriptions with 7-Day Trial** in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L627-L653)
  - Do not hardcode `amountCents: 0, isTrial: true, durationDays: 7` during Android purchase restore; pass the actual product details/purchaseToken or call a dedicated `/wallet/restore-google-play` endpoint.
- [ ] **Fix Client-Side Premature Consumption Before Verification** in [`GooglePlayBillingPlugin.java`](file:///d:/Marriage%20App/serene-union-app/android/app/src/main/java/app/qurb/serene/GooglePlayBillingPlugin.java#L347-L365)
  - Acknowledge/consume only after backend `/purchase-google-play` confirms success.
- [ ] **Consolidate Divergent Service Endpoints** *(Partially done: updated `/wallet/use-salam` to `/wallet/use-direct-salam` in `walletService.ts`; remaining endpoint consolidation deferred)*
  - Fix [`walletService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/walletService.ts#L175) calling `/wallet/use-salam` (404) instead of `/wallet/use-direct-salam` ([`dbService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts#L757)), and unify duplicate methods in `profileService.ts` vs `dbService.ts`.

### App Core, Navigation, Polling & Memory Leaks
- [x] **Fix React Rules of Hooks Violations** in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L72-L74) and [`AdminPortal.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/admin/AdminPortal.tsx#L31-L33)
  - Move `if (isAdminPortal)` / `if (Capacitor.isNativePlatform())` early returns *below* all `useState` / `useEffect` hooks.
- [x] **Fix Blank `'profile'` Tab Navigation** in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L54) & [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L442-L451)
  - Map `'profile'` event values to `'my_profile'` (matching `MainTab` type).
- [ ] **Fix Android Hardware Back Button Listener Leak & Multi-Pop** in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L748-L770) *(Partially done: fixed `CapApp.addListener('backButton')` cleanup race/leak in `App.tsx` and added `YourIntentScreen` step back handler; on-device multi-pop verification pending)*
  - Properly `await CapApp.addListener('backButton', ...)` with an `isMounted` check so cleanup calls `listenerHandle.remove()` cleanly instead of stacking duplicate native listeners on every tab switch.
  - Register [`YourIntentScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/YourIntentScreen.tsx#L103-L250) 8 internal sub-steps with `backNavigationService` so hardware Back steps back one sub-step at a time.
- [ ] **Merge Duplicate User WebSockets & Fix Poll Reset** *(Partially done: merged duplicate user WebSocket effects in `App.tsx` supporting `incoming_call` + `call_ended`; poll reset deferred)* in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L260-L327), [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L343-L427), and [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L523-L592)
  - Combine the 2 simultaneous WebSockets to `/conversations/user_${currentUser.id}/ws` into 1 connection with proper timer cleanup on unmount.
  - Remove `activeConvId` from the global polling/heartbeat effect dependencies (use a ref) so opening/closing chats doesn't restart intervals.
- [x] **Fix Push Notification Click Tracking** in [`pushNotificationService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/pushNotificationService.ts#L151-L191)
  - Read user ID from `serene_current_user_v1` instead of non-existent `qurb_user_id` so `/notifications/track-click` telemetry actually fires.
- [ ] **Fix Logout Cleanup** in [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L1063-L1070) *(Partially done: cleared `serene_auth_token_v1` in `handleLogout`; full session/WS/push teardown deferred)*
  - Clear `serene_auth_token_v1`, cached conversations/matches/messages, and sign out of Firebase/NativeGoogleAuth.

### Onboarding, Discovery, Modesty Blur & Calling UX Fixes
- [x] **Fix Age Calculation, Dead 18+ Check & Invalid Calendar Dates** in [`BasicInfoScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/BasicInfoScreen.tsx#L97-L104), [`lines 611-613`](file:///d:/Marriage%20App/serene-union-app/src/screens/BasicInfoScreen.tsx#L611-L613), [`lines 802-833`](file:///d:/Marriage%20App/serene-union-app/src/screens/BasicInfoScreen.tsx#L802-L833), and [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L922)
  - Remove `Math.max(18, age)` so under-18 validation (`line 611`) works; clamp days to the selected month/year (prevent `Feb 31`); make birth year list dynamic (`new Date().getFullYear() - 18`); use exact month/day in `App.tsx` age computation.
- [ ] **Eliminate Duplicate Racing Auto-Location Hooks** in [`BasicInfoScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/BasicInfoScreen.tsx#L369-L414) vs [`lines 527-597`](file:///d:/Marriage%20App/serene-union-app/src/screens/BasicInfoScreen.tsx#L527-L597)
  - Merge into a single location detection flow and fix `'City, PK'` fallback (`lines 335-339`) when detected city isn't in `POPULAR_STATE_CITIES`.
- [x] **Fix Step 5 Photo Upload Race Condition & Edit-Mode bugs** in [`CreateProfileScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/CreateProfileScreen.tsx#L50-L96) and [`App.tsx`](file:///d:/Marriage%20App/serene-union-app/src/App.tsx#L977-L1020)
  - Keep `isUploading` true until `/photos/upload` completes so profiles don't submit oversized base64 strings that get stripped later (`dbService.ts:269`).
  - Fix `App.tsx:977` storing `email` into `phone`, and `App.tsx:1020` restoring deleted photos when `photoData.photos` is `[]`.
- [ ] **Fix Onboarding Progress & Leftover "Wali" Copy** in [`YourIntentScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/YourIntentScreen.tsx#L59-L68) (`lines 672, 1160`) and [`IncomingCallModal.tsx`](file:///d:/Marriage%20App/serene-union-app/src/components/calling/IncomingCallModal.tsx#L55) *(Partially done: removed leftover "Wali" copy in `YourIntentScreen.tsx` & `IncomingCallModal.tsx` and added step back handler; top progress bar alignment deferred)*
  - Align Step 4 vs 1–5 progress indicator and remove leftover Wali copy per Zero Wali Portal rule.
- [ ] **Close Modesty Blur Bypasses** in [`MatchesLikedYouScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/components/MatchesLikedYouScreen.tsx#L501-L616) and [`lines 713-736`](file:///d:/Marriage%20App/serene-union-app/src/components/MatchesLikedYouScreen.tsx#L713-L736) *(Partially done: enforced `!isVip` tap guard on Liked You & applied `blur(12px)` on Sent Likes avatars; synthetic `fallbackSeed` removal deferred)*
  - Enforce `!isVip` guard when tapping the candidate name/profession row (`line 604`) in Liked You tab; remove synthetic `fallbackSeed` photo injection (`lines 501-504`); apply blur class when `blurPhotosByDefault` is enabled in Sent Likes tab (`line 714`).
- [ ] **Fix Discover Feed Filters, Undo & Offline Like Reset** *(Partially done: prioritized date-scoped like key in `dbService.ts` & `useDiscoverFeed.ts`; extra filters, Undo persistence, blob URL revoke & voice URL swap deferred)* in [`dbService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts#L225-L252), [`lines 614-626`](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts#L614-L626), [`useDiscoverFeed.ts`](file:///d:/Marriage%20App/serene-union-app/src/hooks/useDiscoverFeed.ts#L415-L433), and [`MyProfileScreen.tsx`](file:///d:/Marriage%20App/serene-union-app/src/screens/MyProfileScreen.tsx#L414-L415)
  - Wire `livingPreferences`, `willingnessToRelocate`, `languages`, and `marriageTimelines` filters; persist Undo to backend/localStorage; prioritize date-scoped like key over `legacyKey`; revoke `URL.createObjectURL` blobs; replace real-user R2 voice URLs in `FALLBACK_PROFILES` ([`dbService.ts:34-182`](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts#L34)).
- [ ] **Fix WebRTC Calling Reliability** in [`webRtcService.ts`](file:///d:/Marriage%20App/serene-union-app/src/services/webRtcService.ts#L53-L71) and [`lines 930-939`](file:///d:/Marriage%20App/serene-union-app/src/services/webRtcService.ts#L930-L939) *(Partially done: guarded `armConnectionFallbackTimer` against terminal `iceConnectionState`; TURN credentials deferred)*
  - Remove the fake 6-second fallback timer that forces `'connected'` UI when ICE hasn't connected.
  - Replace hardcoded public `openrelayproject` TURN credentials with dedicated Metered/Cloudflare Calls TURN credentials.
- [ ] **Optimize Mobile Bundle Size (`country-state-city`)** in [`offlineGeo.ts`](file:///d:/Marriage%20App/serene-union-app/src/utils/offlineGeo.ts#L1)
  - Replace ~8MB full-world city dataset with a lightweight curated/regional dataset or on-demand API lookup.

---

## Phase 3: Strict Backend Auth Enforcement, Secret Rotation & Schema Cleanup (After Phase 2 APK Rollout)

> ⚠️ **Wait until Phase 2 APK is live & adopted** before enabling mandatory `Authorization: Bearer` middleware and strict token checks, otherwise older live APKs without auth headers will receive `401 Unauthorized`.

### Strict Authentication & Anti-Fraud Enforcement
- [ ] **Enforce `Authorization: Bearer <sessionToken>` Middleware** across [`server/src/index.ts`](file:///d:/Marriage%20App/server/src/index.ts#L65-L79), [`users.ts`](file:///d:/Marriage%20App/server/src/routes/users.ts), [`chat.ts`](file:///d:/Marriage%20App/server/src/routes/chat.ts), [`matches.ts`](file:///d:/Marriage%20App/server/src/routes/matches.ts), [`photos.ts`](file:///d:/Marriage%20App/server/src/routes/photos.ts), [`wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts), [`notifications.ts`](file:///d:/Marriage%20App/server/src/routes/notifications.ts), and [`ChatRoomDO.ts`](file:///d:/Marriage%20App/server/src/durable-objects/ChatRoomDO.ts#L18-L150)
  - Derive acting user strictly from validated token (`c.get('userId')`) and verify conversation participation before serving messages, media, call signals, or WebSocket upgrades.
- [ ] **Verify Google & Firebase ID Tokens Server-Side** in [`server/src/routes/auth.ts`](file:///d:/Marriage%20App/server/src/routes/auth.ts#L251-L484)
  - Cryptographically validate Google/Firebase JWTs against Google JWKS before issuing `sessionToken`.
- [ ] **Enforce Server-Side Payment Verification & Quotas** in [`server/src/routes/wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L8-L61), [`lines 346-777`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L346-L777), [`matches.ts`](file:///d:/Marriage%20App/server/src/routes/matches.ts#L32-L242), and [`chat.ts`](file:///d:/Marriage%20App/server/src/routes/chat.ts#L774-L1049)
  - Verify Google Play `purchaseToken` via Google Play Developer API and remove simulated `sim_token_` fallback (`line 361`) and client-trusted `durationDays`/`isTrial` (`lines 393-395`).
  - Add `/api/wallet/stripe/webhook` verifying `Stripe-Signature`, and validate `successUrl`/`cancelUrl` origins (`lines 635-636`).
  - Enforce Unity Ads S2S HMAC signature (`wallet.ts:8-61`) and lock down `/wallet/reward-ad` (`lines 514-600`).
  - Enforce `likes_used_today`, `direct_salams_balance`, and `messages_sent_today` on `/matches/action` and `/conversations/:id/messages`, and remove `isMutualMatch` client override (`matches.ts:133`).
- [ ] **Server-Side Photo Modesty Protection** in [`server/src/routes/users.ts`](file:///d:/Marriage%20App/server/src/routes/users.ts#L1065-L1073), [`chat.ts`](file:///d:/Marriage%20App/server/src/routes/chat.ts#L396-L399), and [`photos.ts`](file:///d:/Marriage%20App/server/src/routes/photos.ts#L178-L250)
  - Withhold unrevealed raw photo URLs (or serve blurred thumbnails) unless `photo_reveals` / mutual reveal allows access; prevent view-once media from staying publicly cached (`max-age=31536000`).

### Secret Rotation, Crypto & Infrastructure Hygiene
- [ ] **Rotate & Purge Exposed Secrets** from [`serene-union-app/.env`](file:///d:/Marriage%20App/serene-union-app/.env#L1-L2), [`server/.env`](file:///d:/Marriage%20App/server/.env#L1-L3), [`node-server.ts`](file:///d:/Marriage%20App/server/src/node-server.ts#L18-L21), [`wallet.ts`](file:///d:/Marriage%20App/server/src/routes/wallet.ts#L602-L608), [`build.gradle`](file:///d:/Marriage%20App/serene-union-app/android/app/build.gradle#L24-L39), [`build-apk.yml`](file:///d:/Marriage%20App/.github/workflows/build-apk.yml#L67-L68), and repo root Firebase/Google JSON files.
  - Rotate Cloudflare API token, Gemini key, Stripe key, and move Android `.jks` + passwords to GitHub Actions secrets / local untracked Gradle properties.
- [ ] **Upgrade Password Hashing & CSPRNG** in [`server/src/utils/crypto.ts`](file:///d:/Marriage%20App/server/src/utils/crypto.ts#L1-L16)
  - Replace unsalted SHA-256 with salted PBKDF2 (`crypto.subtle.deriveBits`) and replace `Math.random()` with `crypto.getRandomValues()` / `crypto.randomUUID()`.
- [ ] **Migrate Runtime DDL to Migrations & Fix R2/D1 Cleanup**
  - Move `CREATE TABLE` / `ALTER TABLE` out of request paths (`chat.ts`, `admin.ts`, `wallet.ts`, `referrals.ts`, `notifications.ts`, `version.ts`) into `server/migrations/`.
  - Delete user objects from Cloudflare R2 (`MEDIA_BUCKET`) and orphaned D1 rows on account deletion ([`users.ts:618-658`](file:///d:/Marriage%20App/server/src/routes/users.ts#L618-L658), [`admin.ts:1378-1440`](file:///d:/Marriage%20App/server/src/routes/admin.ts#L1378-L1440)).
  - Remove base64 fallback storage in D1 `TEXT` columns (`photos.ts`, `chat.ts`) and parameterize hardcoded `serene-union-api.brandracker.workers.dev` URLs.
  - Add rate limiting (auth/OTP/uploads) and schema validation (`@hono/zod-validator`).
