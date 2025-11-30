// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ For login/signup

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGJj0djIVUwLAUH11eTxTwbRZh4sHWVEI",
  authDomain: "mindspace-126ce.firebaseapp.com",
  projectId: "mindspace-126ce",
  storageBucket: "mindspace-126ce.firebasestorage.app",
  messagingSenderId: "668021264883",
  appId: "1:668021264883:web:48fafb317e55554cc54286",
  measurementId: "G-ZGKSH4J7ZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ Export this for use in Auth.jsx

