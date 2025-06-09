// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAzYQtpxrNSIMdodnheNbf52q5tWSdxas",
  authDomain: "pel-sr-inventory-ms.firebaseapp.com",
  projectId: "pel-sr-inventory-ms",
  storageBucket: "pel-sr-inventory-ms.firebasestorage.app",
  messagingSenderId: "492383385577",
  appId: "1:492383385577:web:306344efbf441c90f03d78",
  measurementId: "G-SHP5M6WBE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
