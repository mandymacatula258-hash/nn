import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyDiwoGgHeq-7i0WzdIT1Bx2lwH9CHucELc",
  authDomain:        "impaq-optics.firebaseapp.com",
  projectId:         "impaq-optics",
  storageBucket:     "impaq-optics.firebasestorage.app",
  messagingSenderId: "198164470832",
  appId:             "1:198164470832:web:40141c18a1e8f1c624e1f5",
  measurementId:     "G-9WNF2QM4JK"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;