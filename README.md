# Amenity Room Bookings

A booking page for the residents' amenity room. It's hosted free on GitHub Pages, and Firebase (on
its free Spark plan) stores the bookings.

- `index.html` is the page.
- `JS/backend.js` connects the page to Firebase.
- `JS/firebase-config.js` holds your project's settings.
- `firestore.rules` controls who can read and write what.
- `email-sender.md` describes the booking and key-reminder emails, which aren't connected yet.
- `amenity-room.html` is the older claude.ai version of the page.

## One-time Firebase setup

1. Go to https://console.firebase.google.com, choose **Add project** and turn Google Analytics off.
2. **Build → Authentication → Get started.** Under **Sign-in method**, enable **Anonymous** and
   **Email/Password**.
3. **Authentication → Users → Add user.** Enter the office email and a password. Copy the user's
   **UID**.
4. **Build → Firestore Database → Create database.** Pick a nearby location and start in
   **production mode**.
5. **Firestore → Rules.** Paste in `firestore.rules`, replace `PASTE_ADMIN_UID` with the UID from
   step 3, then choose **Publish**.
6. **Project settings (gear icon) → Your apps → Web (`</>`).** Register the app, then copy the
   `firebaseConfig` values into `JS/firebase-config.js`. Put the same UID in `ADMIN_UID`.
7. **Authentication → Settings → Authorized domains.** Add `<your-github-username>.github.io`.

Residents don't need an account. Each browser gets its own anonymous identity, so people can see
and cancel bookings they made from that browser. The office signs in at the bottom of the page to
see contact details and to confirm or cancel any booking.

## Publishing changes

Commit and push to `main`. GitHub Pages updates the site within a minute or two.
