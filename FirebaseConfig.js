import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.EXPO_PUBLIC_API_KEY}`,
  authDomain: `${process.env.EXPO_PUBLIC_AUTH_DOMAIN}`,
  projectId: 'nourish-me-8e6b6',
  storageBucket: 'nourish-me-8e6b6.appspot.com',
  messagingSenderId: '48697384631',
  appId: '1:48697384631:web:58c344c956013d69e0f732',
  measurementId: 'G-XQXZ8RYSRQ',
};

// Initialize Firebase
export const FIREBASE_APP = !firebase.apps.length
  ? initializeApp(firebaseConfig)
  : null;
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
