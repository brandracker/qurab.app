# Serene Union — Master Architecture & Codebase Map

This document serves as the single source of truth for repository structure, feature ownership, and component relationships across both the frontend (`serene-union-app`) and backend (`server`). Use this index to locate, diagnose, and modify features instantly.

---

## 🗺️ High-Level System Architecture

```text
d:\Marriage App\
├── serene-union-app\           # Frontend (React 18, Vite, TypeScript, TailwindCSS)
│   ├── src\
│   │   ├── screens\           # Full-page views & Onboarding Wizard steps
│   │   ├── components\        # Core feature hubs (Discover, Matches, Chat, Settings)
│   │   ├── services\          # Domain services (Profiles, Matches, Chat, Wallet, Notifications)
│   │   ├── types\             # Universal TypeScript interfaces
│   │   └── utils\             # Audio recording, image compression, compatibility scoring
│   └── tests\                 # Vitest automated test suite (30 test suites, 99 tests)
│
├── server\                    # Backend (Cloudflare Workers, Hono, Cloudflare D1 SQL)
│   ├── src\
│   │   ├── routes\            # Layered modular routers (auth, users, matches, chat, wallet, etc.)
│   │   ├── index.ts           # Master router entrypoint & CORS
│   │   └── types.ts           # Worker bindings & environment variables
│   └── migrations\            # Cloudflare D1 SQL migrations (0001 - 0005)
```

---

## 🧭 Feature Matrix & Component Lookup

| Feature Area | UI Screen / Component | Domain Service | Backend Worker Route | Cloudflare D1 Table |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `src/screens/AuthScreen.tsx`<br>`src/screens/WelcomeScreen.tsx` | `firebase.ts`<br>`dbService.ts` | `/api/auth/signup`<br>`/api/auth/login`<br>`/api/auth/email-sync` | `users` |
| **5-Step Onboarding** | `BasicInfoScreen.tsx`<br>`ReligiousPracticeScreen.tsx`<br>`FamilyLifestyleScreen.tsx`<br>`YourIntentScreen.tsx`<br>`CreateProfileScreen.tsx` | `profileService.ts`<br>`dbService.ts` | `POST /api/users` | `users`<br>`religious_profiles`<br>`user_photos` |
| **Discover Feed** | `src/components/DiscoverFeed.tsx`<br>`src/components/ProfileDetailModal.tsx` | `matchService.ts`<br>`profileService.ts` | `GET /api/profiles/discover`<br>`POST /api/matches/action` | `users`<br>`matches_and_likes` |
| **Matches & Likes Hub** | `src/components/MatchesLikedYouScreen.tsx`<br>`src/components/MutualMatchModal.tsx` | `matchService.ts` | `GET /api/matches/received`<br>`GET /api/matches/mutual`<br>`GET /api/matches/activity` | `matches_and_likes` |
| **Messaging & Chat** | `src/components/ChatScreen.tsx` | `chatService.ts` | `GET /api/conversations`<br>`POST /api/conversations/:id/messages`<br>`POST /api/conversations/photo-reveal` | `conversations`<br>`photo_reveals` |
| **My Profile & Editing** | `src/screens/MyProfileScreen.tsx`<br>`src/screens/BasicInfoScreen.tsx` | `profileService.ts` | `GET /api/users/:id`<br>`PUT /api/users/:id`<br>`POST /api/users/bio` | `users`<br>`religious_profiles` |
| **Voice Greeting Intro** | `MyProfileScreen.tsx` (recorder)<br>`DiscoverFeed.tsx` (player) | `dbService.ts` | `POST /api/photos/upload-voice`<br>`GET /api/photos/media/:filename` | `users` (`voice_greeting_url`) |
| **Settings & Privacy** | `src/components/SettingsPrivacy.tsx` | `profileService.ts` | `POST /api/users/:id/deactivate`<br>`DELETE /api/users/:id` | `users` (`account_status`) |
| **Wallet, VIP & Boost** | `MembershipUpgradeModal.tsx`<br>`RewardedAdModal.tsx` | `walletService.ts` | `GET /api/wallet/:userId`<br>`POST /api/wallet/use-like`<br>`POST /api/wallet/stripe/...` | `wallet_balances` |
| **Notifications** | `src/screens/NotificationsScreen.tsx` | `notificationService.ts` | `GET /api/notifications`<br>`POST /api/notifications/mark-read` | `notifications` |

---

## 📁 Key Files & Lines Directory

### 1. Frontend (`serene-union-app/src/`)
- **[App.tsx](file:///d:/Marriage%20App/serene-union-app/src/App.tsx)**: Root controller managing authentication state, active tab navigation (5 tabs), onboarding step routing, and global modals.
- **[services/dbService.ts](file:///d:/Marriage%20App/serene-union-app/src/services/dbService.ts)**: Central facade exporting unified methods across all domain services.
- **[services/profileService.ts](file:///d:/Marriage%20App/serene-union-app/src/services/profileService.ts)**: Profile hydration, live bio updates, modesty privacy settings, and account lifecycle.
- **[services/matchService.ts](file:///d:/Marriage%20App/serene-union-app/src/services/matchService.ts)**: Swiping actions (`liked`, `passed`), candidate feeds, mutual match detection, and block list.
- **[services/chatService.ts](file:///d:/Marriage%20App/serene-union-app/src/services/chatService.ts)**: Live messaging, conversation history, and 1-to-1 photo reveal toggling.
- **[services/walletService.ts](file:///d:/Marriage%20App/serene-union-app/src/services/walletService.ts)**: Daily like counters, rewarded ad credit, VIP subscriptions, and city spotlight rank.

### 2. Backend Routes (`server/src/routes/`)
- **[routes/auth.ts](file:///d:/Marriage%20App/server/src/routes/auth.ts)**: Sign up, login, and Firebase token synchronization.
- **[routes/users.ts](file:///d:/Marriage%20App/server/src/routes/users.ts)**: User CRUD, profile updates, account deactivation/deletion, and bio updates.
- **[routes/matches.ts](file:///d:/Marriage%20App/server/src/routes/matches.ts)**: Matching actions, incoming likes (`/received`), mutual matches (`/mutual`), and full activity hub (`/activity`).
- **[routes/chat.ts](file:///d:/Marriage%20App/server/src/routes/chat.ts)**: Conversation list with partner metadata, message dispatching, and photo reveals.
- **[routes/wallet.ts](file:///d:/Marriage%20App/server/src/routes/wallet.ts)**: Wallet quotas, Stripe checkout sessions, and rewarded ad claim endpoints.

---

## 🔑 Client-Side Storage Keys (`localStorage`)

| Key Name | Type | Description |
| :--- | :--- | :--- |
| `serene_current_user_v1` | `JSON (UserProfile)` | Current logged-in user profile payload |
| `serene_onboarding_draft_v1` | `JSON ({step, data})`| In-progress onboarding / profile editing draft |
| `serene_auth_token_v1` | `string` | Active session JWT or Firebase auth token |
| `serene_likes_left_{userId}_{date}` | `number` | Daily remaining like quota |
| `serene_vip_{userId}` | `boolean` | Cached VIP subscriber status |
| `serene_real_conversations_v3` | `JSON (Conversation[])` | Cached conversations and message history |

---

## ⚡ Quick Diagnostic Playbook

1. **User sees previous data when clicking Edit Profile?**
   - Check `serene_onboarding_draft_v1`. Clear draft on edit trigger so live D1 profile is loaded fresh.
2. **Photos missing after profile fetch?**
   - Check `server/src/routes/users.ts` GET `/users/:id` response object; ensure `photos: (photos || []).map(...)` is included.
3. **Candidate disappears after match?**
   - Candidate has moved from "Liked You" (`action = 'liked'`) to the "Mutual" tab (`action = 'mutual_match'`).
4. **Chat shows blank / "No Conversations"?**
   - Ensure `activeConv` fallback handles newly created conversations before background D1 polling completes.
