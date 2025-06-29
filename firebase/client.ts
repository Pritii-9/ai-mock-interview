import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDS-RUzo1RT1wB8RJi9SCMYwZdAH1TJ8Ig",
  authDomain: "prepwise-65a5e.firebaseapp.com",
  projectId: "prepwise-65a5e",
  storageBucket: "prepwise-65a5e.firebasestorage.app",
  messagingSenderId: "915509665508",
  appId: "1:915509665508:web:16fba66aef9e91db7196f1",
  measurementId: "G-RJGDWFZ7W0"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
