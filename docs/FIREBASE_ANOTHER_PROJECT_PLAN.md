# Plan: Use the Same Firebase Project in Another Repository

Use this plan to connect a **different codebase** to your existing Firebase project (same account, same project — e.g. `simplexalabs`). No new Firebase project is created; you reuse the same config.

---

## 1. Firebase Console (Optional: add a new app)

- **Option A – Reuse the same Web app**  
  Use the same Web app config (API key, project ID, etc.) in the new repo. Easiest; both apps share the same Firebase project and data.

- **Option B – Register a new Web app in the same project**  
  In [Firebase Console](https://console.firebase.google.com) → your project → **Project settings** → **Your apps** → **Add app** → **Web** (</>).  
  You get a second config (different `appId`, possibly `apiKey`). Use this if you want to separate analytics/deploy per app while still using the same Firestore/Auth.

For both options you’ll need the **same 6 values** in the new repo (from the existing app or the new one):  
`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

---

## 2. Install Firebase in the new repository

```bash
npm install firebase
```

Suggested version (to match Simplexa-Labs): `firebase@^12.10.0`.

---

## 3. Environment variables

Create or edit `.env` in the **new project root** (and add `.env` to `.gitignore` if not already). Use the **exact same values** from your current project (or from the new Web app if you chose Option B):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Copy these from Simplexa-Labs’ `.env` (or from Firebase Console → Project settings → Your apps → config object).

---

## 4. TypeScript env types (Vite)

If the new project uses Vite + TypeScript, add the Firebase env types so `import.meta.env.VITE_FIREBASE_*` is typed. In `src/vite-env.d.ts` (or the file that has `/// <reference types="vite/client" />`), add to `ImportMetaEnv`:

```ts
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}
```

---

## 5. Firebase initialization module

Create a single module that initializes the app and exports Auth and Firestore (adjust path to match the new repo structure, e.g. `src/lib/firebase.ts`):

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Use `auth` and `db` everywhere in the new app instead of initializing Firebase again.

---

## 6. Auth domain / authorized domains (if needed)

If the new app runs on a different origin (e.g. `localhost:5174` or a new domain):

- Firebase Console → **Authentication** → **Settings** → **Authorized domains**  
- Add the new app’s domain (and `localhost` for local dev).

Without this, sign-in (e.g. Google) may be blocked on the new app.

---

## 7. Use Auth and Firestore in the new app

- **Auth:**  
  Import from `firebase/auth`: e.g. `signInWithEmailAndPassword`, `signInWithPopup`, `GoogleAuthProvider`, `onAuthStateChanged`, `signOut`. Use the exported `auth` from your `firebase.ts` module.

- **Firestore:**  
  Import from `firebase/firestore`: e.g. `collection`, `doc`, `getDoc`, `setDoc`, `addDoc`, `query`, `where`, `getDocs`, `serverTimestamp`. Use the exported `db` from your `firebase.ts` module.

Example:

```ts
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
```

You can replicate patterns from Simplexa-Labs (e.g. `AuthContext`, user profile in Firestore) as needed.

---

## 8. Firebase tooling in the new repo (optional)

If you want to deploy Firestore rules or other Firebase config from the **new** repository:

- Install Firebase CLI: `npm install -D firebase-tools` (or use globally).
- Log in: `npx firebase login` (same Google account as the existing project).
- In the new repo root: `npx firebase init` → choose **Firestore** (and any other products). When asked for the project, select your **existing** project (e.g. `simplexalabs`).
- This creates `firebase.json` and optionally `firestore.rules`. You can copy `firestore.rules` from Simplexa-Labs so both repos use the same rules, or maintain rules in one repo only and deploy from there.

If you only need to **use** Firebase (read/write data, auth) and will deploy rules from Simplexa-Labs (or the console), you can skip this step.

---

## 9. Checklist

| Step | Action |
|------|--------|
| 1 | Decide: reuse same Web app config or add a new Web app in the same project. |
| 2 | `npm install firebase` (e.g. `^12.10.0`). |
| 3 | Add `.env` with all 6 `VITE_FIREBASE_*` variables (same values as Simplexa-Labs or new app). |
| 4 | Add Firebase env types to `ImportMetaEnv` in `vite-env.d.ts`. |
| 5 | Create `src/lib/firebase.ts` (or equivalent) with `app`, `auth`, `db`. |
| 6 | Add the new app’s domain to **Authorized domains** in Firebase Console if different from Simplexa-Labs. |
| 7 | Use `auth` and `db` in the new app for Auth and Firestore. |
| 8 | (Optional) Run `firebase init` in the new repo if you want to deploy rules/config from there. |

---

## Summary

- **Same account, same project:** no new Firebase project; reuse project ID and (optionally) the same Web app config.
- **New repo:** install `firebase`, same env vars, same init module pattern, then use `auth` and `db` everywhere.
- **Different domain:** add it to Authorized domains so Auth works.
- **Optional:** add Firebase CLI in the new repo only if you want to deploy Firestore rules from that repo; otherwise one repo or the console is enough.

After this, the other repository will use the same Firebase project (same Firestore data, same Auth users) as Simplexa-Labs.
