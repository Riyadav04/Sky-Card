// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByQh6GYzlaiGg1vd2fTVfCqrVpvwPf4Iw",
  authDomain: "sky-card-2a19e.firebaseapp.com",
  projectId: "sky-card-2a19e",
  storageBucket: "sky-card-2a19e.firebasestorage.app",
  messagingSenderId: "579596007161",
  appId: "1:579596007161:web:e529ae29a7a5d246109428",
  measurementId: "G-0B5EVCVFQP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auths= getAuth(app);
export const googleProvider=new GoogleAuthProvider()