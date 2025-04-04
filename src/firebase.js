// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChIYB3C1Ak1kkKPvFcplQo9X90yDchN9c",
  authDomain: "messagingapp-62e7a.firebaseapp.com",
  projectId: "messagingapp-62e7a",
  storageBucket: "messagingapp-62e7a.appspot.com", // ✅ fix .app -> .app**spot**.com
  messagingSenderId: "1062996877854",
  appId: "1:1062996877854:web:5921c5b8197d20910f840f",
  measurementId: "G-811T1RSDS4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
