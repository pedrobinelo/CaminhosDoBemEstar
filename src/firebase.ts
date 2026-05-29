// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRdpEvpThypVv9jvGGiNPCgWHv0UgB9GI",
  authDomain: "caminhos-do-bem-estar.firebaseapp.com",
  projectId: "caminhos-do-bem-estar",
  storageBucket: "caminhos-do-bem-estar.firebasestorage.app",
  messagingSenderId: "843987276267",
  appId: "1:843987276267:web:e28d2b8eed0db6adb2c9ae",
  measurementId: "G-3L5K498TTQ",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
