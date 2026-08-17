import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-expect-error — getReactNativePersistence exists at runtime (Metro resolves
// the RN-specific build) but is missing from firebase's rolled-up .d.ts types.
// See https://github.com/firebase/firebase-js-sdk/issues/7615
import { initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA6NhCBUDoXkpb0SKYViDW1ijXl5oHf5cM',
  authDomain: 'gymapp-8e39a.firebaseapp.com',
  projectId: 'gymapp-8e39a',
  storageBucket: 'gymapp-8e39a.firebasestorage.app',
  messagingSenderId: '254567905263',
  appId: '1:254567905263:web:2783df9f8d6352a9dd681a',
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // initializeAuth throws if it was already called for this app (e.g. fast refresh)
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
