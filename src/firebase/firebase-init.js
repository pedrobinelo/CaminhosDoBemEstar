import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRdpEvpThypVv9jvGGiNPCgWHv0UgB9GI",
  authDomain: "caminhos-do-bem-estar.firebaseapp.com",
  projectId: "caminhos-do-bem-estar",
  storageBucket: "caminhos-do-bem-estar.firebasestorage.app",
  messagingSenderId: "843987276267",
  appId: "1:843987276267:web:e28d2b8eed0db6adb2c9ae",
  measurementId: "G-3L5K498TTQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
