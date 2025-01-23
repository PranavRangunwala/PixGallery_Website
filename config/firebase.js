// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore"
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
  apiKey: "FROM-FIREBASE",
  authDomain: "FROM-FIREBASE",
  databaseURL: "FROM-FIREBASE",
  projectId: "FROM-FIREBASE",
  storageBucket: "FROM-FIREBASE",
  messagingSenderId: "FROM-FIREBASE",
  appId: "FROM-FIREBASE",
  measurementId: "FROM-FIREBASE"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const imgdb = getStorage(app);