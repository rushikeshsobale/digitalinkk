// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI33LWhIxIRbxWuSh4OdzAIszbmI5cy0Q",
  authDomain: "digitalinkk-36dbe.firebaseapp.com",
  projectId: "digitalinkk-36dbe",
  storageBucket: "digitalinkk-36dbe.firebasestorage.app",
  messagingSenderId: "109176451677",
  appId: "1:109176451677:web:dfbcc7db748b2bb21a13b4",
  measurementId: "G-BKS96N3Z6D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);