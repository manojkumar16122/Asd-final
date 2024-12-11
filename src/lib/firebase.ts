import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBVpEDIzgiN5y4q8zp5Y_EX895JeMxaqE4",
  authDomain: "autism-2b98e.firebaseapp.com",
  databaseURL: "https://autism-2b98e-default-rtdb.firebaseio.com",
  projectId: "autism-2b98e",
  storageBucket: "autism-2b98e.firebasestorage.app",
  messagingSenderId: "894066485282",
  appId: "1:894066485282:web:7d69537711a7c1bdb3027b",
  measurementId: "G-XJMRRL78QD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

// Enable persistent auth state
setPersistence(auth, browserLocalPersistence);