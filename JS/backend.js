// Firebase backend with the same small db/user surface the page used on claude.ai:
// db.doc(path).get/set/acquire, db.collection(name).get/onSnapshot, user.id/isOwner/can.
// Residents are signed in anonymously (one identity per browser); the office signs in with email + password.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, onSnapshot, runTransaction }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js";

export const configured = !firebaseConfig.apiKey.startsWith("PASTE_");

let app, auth, fs;
if (configured) { app = initializeApp(firebaseConfig); auth = getAuth(app); fs = getFirestore(app); }

const wrapDoc = s => ({ id: s.id, exists: s.exists(), data: () => s.data() });

const db = configured && {
  doc(path) {
    const ref = doc(fs, path);
    return {
      async get() { return wrapDoc(await getDoc(ref)); },
      set(data) { return setDoc(ref, data); },
      // short lease so two people can't book the same day at the same moment
      acquire({ holder, ttlMs }) {
        return runTransaction(fs, async tx => {
          const cur = await tx.get(ref), now = Date.now();
          if (cur.exists() && cur.data().holder !== holder && cur.data().until > now) return { acquired: false };
          tx.set(ref, { holder, until: now + ttlMs });
          return { acquired: true };
        });
      }
    };
  },
  collection(name) {
    const ref = collection(fs, name);
    const wrap = snap => ({ docs: snap.docs.map(wrapDoc) });
    return {
      async get() { return wrap(await getDocs(ref)); },
      onSnapshot(cb, err) { return onSnapshot(ref, s => cb(wrap(s)), err); }
    };
  }
};

// Resolves {db, user} once someone is signed in (anonymously if nobody else is).
export function connect() {
  if (!configured) return Promise.resolve({ db: null, user: null });
  return new Promise((resolve, reject) => {
    const stop = onAuthStateChanged(auth, u => {
      if (!u) { signInAnonymously(auth).catch(reject); return; }
      stop();
      resolve({ db, user: {
        id: async () => u.uid,
        isOwner: async () => u.uid === ADMIN_UID,
        can: async () => true,
        isAnonymous: u.isAnonymous
      } });
    }, reject);
  });
}

export const officeSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const officeSignOut = () => signOut(auth);
