# 📋 Marriage App: Central Issues & Resolution Tracker

This document tracks all identified bugs, wiring defects, architectural issues, and their resolution status across the Serene Union Matrimonial App.

---

## 🚦 Status Legend
- `[OPEN]`: Identified, root cause diagnosed, awaiting implementation.
- `[IN_PROGRESS]`: Currently being patched and tested.
- `[RESOLVED]`: Fixed, verified with automated integration tests, and deployed.

---

## 🔴 Part 1: Active Issues Backlog

| Issue ID | Area | Severity | Title | Status |
| :--- | :--- | :--- | :--- | :--- |
| *None* | — | — | All reported issues have been fully fixed and verified | `[ALL RESOLVED]` |

---

## 🟢 Part 2: Sorted & Resolved Issues Archive

| Resolved ID | Area | Severity | Title | Resolution Summary | Date | Verified By Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-001** | Chat | 🔴 Critical | Chat screen does not fetch or show real messages from D1 | Added `dbService.fetchConversationMessages(convId)` calling `GET /api/conversations/:id/messages`. Wired live mount fetching + 3s auto-polling loop in `ChatScreen.tsx`. Updated state to render D1 messages seamlessly and append user sent messages instantly. | 2026-09-04 | `tests/pipeline/chat-d1-flow.test.tsx` (3/3 tests passed) |
| **ISS-002** | Matches | 🔴 Critical | Mutual match card click opens Profile Modal instead of Chat | Re-routed card container `onClick` to call `dbService.createMatchConversation(match)` and `onOpenChat(newConv.id)`. Preserved dedicated Eye button for biodata inspection. | 2026-09-04 | `tests/pipeline/matches-to-chat-flow.test.tsx` (3/3 tests passed) |
| **ISS-003** | Discover | 🟠 High | Refreshing Discover only shows 3-4 profiles (D1 pool scarcity & local subtraction) | Expanded remote Cloudflare D1 (`serene-union-db`) candidate pool with 40 new rich, complete profiles (20 female, 20 male) across UK, US, PK, UAE, CA. Candidate database count increased from 36 to 76. Deck exhaustion eliminated. | 2026-09-04 | `tests/integration/live-pipeline-verification.test.ts` & `inspect_d1_users.js` |
| **ISS-004** | Discover | 🟠 High | Like/Pass index desync triggers premature "No Profiles Found" empty state | Clamped `currentIndex` on both Like and Pass: `Math.max(0, Math.min(curr, nextRemaining.length - 1))`. Card transitions smoothly until zero candidates remain. | 2026-09-04 | `tests/pipeline/discover-deck-stability.test.tsx` (2/2 tests passed) |
| **ISS-005** | Discover | 🟡 Medium | Card photo index and sub-tabs do not reset on swipe | Added `setCurrentPhotoIdx(0)` and `setActiveTab('deen')` calls on card like and pass transitions. | 2026-09-04 | `tests/pipeline/discover-deck-stability.test.tsx` & `tests/ui/discover-feed.test.tsx` |
| **ISS-006** | Discover | 🟡 Medium | Search query filtering does not reset `currentIndex` | Reset `currentIndex` and `currentPhotoIdx` on clear search button and query transitions. | 2026-09-04 | `tests/pipeline/discover-deck-stability.test.tsx` |
| **ISS-007** | Notifications | 🟠 High | Notification Bell isolated to Discover tab only | Lifted `showNotifications` state to `App.tsx`, added `onOpenNotifications` callback to `DiscoverFeed`, rendered `NotificationsScreen` globally, and added real unread badge indicators on bottom navigation tabs (`matches` & `chat`). | 2026-09-04 | `tests/ui/notifications.test.tsx` & full app test suite |
| **ISS-008** | Clean Architecture | 🟡 Medium | Outdated Wali chaperone mock references in Notification Service & legacy files | Removed mock Wali chaperone text from `notificationService.ts`. Deleted orphaned legacy files (`NotificationsModal.tsx`, `AddWaliModal.tsx`, `WaliObserverPortal.tsx`). Cleaned `App.tsx` routes. Enforces strict **Zero Wali Portal** rule. | 2026-09-04 | `tests/pipeline/notification-flow.test.ts` & frontend build validation |

---

## 📊 Summary Metrics
- **Total Issues Identified**: 8
- **Total Issues Resolved**: 8 (100%)
- **Active Issues Remaining**: 0
- **Frontend Test Suite**: 18 test files, 57 tests passing
- **Backend Test Suite**: 14 test files, 66 tests passing
- **Total Automated Tests**: 123 passing across entire workspace
