import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const initFirebaseAdmin = () => {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      // === START: FIX - Use snake_case property names ===
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID, // This one is actually correct
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // This should be 'client_email'
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // This should be 'private_key'
      }),
      // === END: FIX ===
    });
  }

  // NOTE: You don't need this check inside the init function
  // return getApp();
};

initFirebaseAdmin();

export const auth = getAuth();
export const db = getFirestore();