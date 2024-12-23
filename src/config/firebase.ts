import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeeu49axPpLWobvezCH0MGUyV6IWiCyw0",
  authDomain: "e-sunlight-418902.firebaseapp.com",
  projectId: "e-sunlight-418902",
  storageBucket: "e-sunlight-418902.firebasestorage.app",
  messagingSenderId: "355998761163",
  appId: "1:355998761163:web:f5d988f6674deb20f5db4e",
  measurementId: "G-EZR08PCQSX",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
