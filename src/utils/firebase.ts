import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCBdKLoZWBIHXR_ZU94A6v4MXczmZb-JmQ",
  authDomain: "byubinfutureworks.firebaseapp.com",
  projectId: "byubinfutureworks",
  storageBucket: "byubinfutureworks.firebasestorage.app",
  messagingSenderId: "189595286483",
  appId: "1:189595286483:web:a4eede18b8d6dfe8410d26",
  measurementId: "G-W3ZPLHE68V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
