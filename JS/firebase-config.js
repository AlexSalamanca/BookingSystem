// Paste the config from Firebase console → Project settings → Your apps → Web app.
// These values are not secrets: the Firestore rules (firestore.rules) are what protect the data.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// The office account's UID (Firebase console → Authentication → Users). Must match ADMIN_UID in firestore.rules.
export const ADMIN_UID = "PASTE_ADMIN_UID";
