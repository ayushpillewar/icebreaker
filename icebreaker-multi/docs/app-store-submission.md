# IceBreaker — Apple App Store Connect Submission Guide

## 1. App Information

| Field | Value |
|---|---|
| **App Name** | IceBreaker |
| **Subtitle** | Meet & Chat with People Nearby |
| **Primary Category** | Social Networking |
| **Secondary Category** | Utilities |
| **Content Rights** | You own or have rights to all content in the app — Yes |
| **Bundle ID** | com.majboormajdoor.icebreaker-multi |
| **SKU** | ICEBREAKER-001 |
| **Version** | 1.0.0 |
| **Copyright** | © 2026 IceBreaker. All rights reserved. |

---

## 2. App Store Description (4 000 character limit)

Paste this verbatim into App Store Connect → App Information → Description.

```
IceBreaker is the simplest way to break the ice with the people right next to you.

No accounts. No internet required. Just Bluetooth.

──────────────────────────────────
HOW IT WORKS
──────────────────────────────────
1. Enter a display name — anything you like.
2. Toggle "Visible to others" to let nearby people see you.
3. IceBreaker uses Bluetooth to show you who else is around.
4. Tap any person to start a private, real-time chat — all over Bluetooth, without the internet.

──────────────────────────────────
PERFECT FOR
──────────────────────────────────
• Networking events, conferences, and meetups
• Coworking spaces and university campuses
• Coffee shops, airports, and transit hubs
• Anywhere you want to connect with the room without scrolling through social media

──────────────────────────────────
PRIVACY BY DESIGN
──────────────────────────────────
• Zero accounts, zero sign-up
• Your name is broadcast only while the visibility toggle is ON — you decide when you're seen
• All messages travel peer-to-peer over Bluetooth; nothing is stored on any server
• No GPS, no tracking, no ads

──────────────────────────────────
FEATURES
──────────────────────────────────
• Live Nearby list with Bluetooth signal strength (closer = stronger signal)
• Unread message badge on each person's card
• Direct peer-to-peer Bluetooth chat — works offline
• Signal strength indicator so you know who's closest
• One tap to connect and start chatting
• Name editable at any time from the Home tab

IceBreaker respects your privacy completely. Your name is the only thing you share, and only when you choose to.
```

---

## 3. Keywords (100 character limit — comma-separated, no spaces after commas)

```
bluetooth,nearby,chat,meet,discover,networking,local,offline,people,icebreaker
```

*(100 characters exactly — do not add spaces after commas as they count toward the limit.)*

---

## 4. Promotional Text (170 character limit — can be updated without a new review)

```
Meet the people around you — no internet, no accounts. Just Bluetooth. Toggle visibility, see who's nearby, and start chatting instantly.
```

---

## 5. What's New in This Version (Version 1.0.0)

```
Welcome to IceBreaker! 

• Discover nearby IceBreaker users via Bluetooth
• Real-time peer-to-peer chat — no internet required
• Set your display name and control when you are visible to others
• Signal-strength indicator shows how close each person is
```

---

## 6. Support & Marketing URLs

| Field | URL to enter in App Store Connect |
|---|---|
| **Support URL** | `https://icebreaker.app/support` (or your GitHub Issues URL) |
| **Marketing URL** | `https://icebreaker.app` (optional) |
| **Privacy Policy URL** | `https://icebreaker.app/privacy-policy` |
| **Terms of Use URL** | `https://icebreaker.app/terms-of-use` |

> **Note:** Host the files in `docs/privacy-policy.html` and `docs/terms-of-use.html`
> on any public URL (e.g. GitHub Pages, Vercel, Netlify) before submitting.
> Apple will refuse submission without a live, accessible Privacy Policy URL.

---

## 7. Age Rating Questionnaire

Answer the following questions in App Store Connect → Age Rating:

| Question | Answer |
|---|---|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Prolonged Graphic or Sadistic Realistic Violence | None |
| Profanity or Crude Humor | None |
| Mature/Suggestive Themes | None |
| Horror/Fear Themes | None |
| Medical/Treatment Information | None |
| Alcohol, Tobacco, or Drug Use or References | None |
| Simulated Gambling | None |
| Sexual Content or Nudity | None |
| Graphic Sexual Content and Nudity | None |
| **Unrestricted Web Access** | **No** |
| **User-Generated Content** | **Yes** — Users can send text messages to nearby users |

> Because User-Generated Content is **Yes**, Apple will assign a minimum rating of **12+**
> and require you to confirm you have content moderation in place.
> Moderation note: IceBreaker messages are peer-to-peer only and never pass through a server.
> There is no central moderation system; users control who they communicate with by proximity.

**Final Age Rating: 12+**

---

## 8. App Privacy — Data Types (App Store Connect → App Privacy)

Apple requires you to declare exactly what data is collected.

### Data Linked to the User

| Data Type | Collected? | Used For | Linked to Identity | Tracking |
|---|---|---|---|---|
| Name (Display Name) | ✅ Yes | App Functionality | No | No |

### Data Not Collected

| Data Type | Collected? |
|---|---|
| Contact Info (email, phone, address) | ❌ No |
| Health & Fitness | ❌ No |
| Financial Info | ❌ No |
| Location (precise or coarse GPS) | ❌ No |
| Sensitive Info | ❌ No |
| Contacts | ❌ No |
| User Content (messages, photos) | ❌ No — messages are peer-to-peer and not stored by us |
| Browsing History | ❌ No |
| Search History | ❌ No |
| Identifiers (Device ID, Ad ID) | ❌ No |
| Usage Data (product interaction, crash data) | ❌ No |
| Diagnostics | ❌ No |

> Select **"No, we do not collect data from this app"** on the App Privacy page
> for all categories EXCEPT Name. For Name, select:
> - Purpose: **App Functionality**
> - Linked to identity: **No**
> - Used for tracking: **No**

---

## 9. App Store Connect — Review Information

| Field | Value |
|---|---|
| **First Name** | (your first name) |
| **Last Name** | (your last name) |
| **Phone Number** | (your phone number with country code) |
| **Email Address** | (your contact email) |
| **Demo Account Username** | Not required (no login) |
| **Demo Account Password** | Not required (no login) |
| **Notes for Reviewer** | See below |

### Notes for App Review (paste into the Notes field):

```
IceBreaker is a Bluetooth-based local discovery and chat app. No account or internet
connection is required to use the app.

To test the app:
1. Launch the app and enter any display name (e.g. "Tester").
2. Toggle "Visible to others" ON from the Home tab.
3. The Nearby tab will display simulated nearby users (mock mode is enabled in
   the build submitted for review, so Bluetooth hardware is NOT required to
   experience the full UI and chat flow).
4. Tap any listed user to open the chat screen and send a message.
   Simulated auto-replies will appear within 1–2 seconds.

All Bluetooth permissions are only requested on the Nearby tab when the device
actually attempts to scan. In the review build, mock data is used instead.

Privacy Policy: https://icebreaker.app/privacy-policy
Terms of Use:   https://icebreaker.app/terms-of-use
```

---

## 10. App Store Screenshots — Required Sizes

Apple requires at least one set of screenshots per device class you support.
Minimum required sets:

| Device | Screen Size | Required |
|---|---|---|
| iPhone 6.7" (iPhone 16 Pro Max / 15 Plus) | 1320 × 2868 px | ✅ Required |
| iPhone 6.5" (iPhone 11 Pro Max / XS Max) | 1242 × 2688 px | ✅ Required |
| iPad Pro 12.9" (if supporting iPad) | 2048 × 2732 px | Optional |

Recommended screenshots to capture (5 maximum per device):
1. **Home screen** — display name set, visibility toggle ON, green "Broadcasting" banner
2. **Nearby tab** — list of 3–4 nearby users with signal bars and unread badge
3. **Chat screen** — active conversation with a mock peer, showing bubbles and message input
4. **Onboarding / UserSetup screen** — "Welcome to IceBreaker" name-entry screen
5. **Home screen dark mode** (optional) — if supporting dark mode in a future release

---

## 11. Apple Standard EULA Reference

IceBreaker uses **Apple's Standard End User License Agreement**.
You do not need to write a custom EULA unless you want different terms.

To use the standard EULA in App Store Connect:
- In App Store Connect → App Information → License Agreement, select
  **"Use the default Apple End User License Agreement"**.

Standard EULA URL (for reference in your Terms of Use document):
```
https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
```

---

## 12. Pre-Submission Checklist

- [ ] Privacy Policy hosted at a live public URL
- [ ] Terms of Use hosted at a live public URL
- [ ] `app.json` `ios.bundleIdentifier` matches the bundle ID registered in App Store Connect
- [ ] App icons supplied for all required sizes (Expo handles this from `assets/images/icon.png`)
- [ ] Screenshots captured for iPhone 6.7" and 6.5"
- [ ] Age rating questionnaire completed (User-Generated Content = Yes → 12+)
- [ ] App Privacy data types declared in App Store Connect
- [ ] Build uploaded via `eas build --platform ios --profile production` or Xcode
- [ ] Build submitted for review in App Store Connect → TestFlight or Releases
- [ ] Review notes filled in (see Section 9)
- [ ] Contact information for review team provided
