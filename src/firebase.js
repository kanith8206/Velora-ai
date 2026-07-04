import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDPFcRh2UH2i1wiwTMG_Gz_mkklSvhJxA",
  authDomain: "modular-vine-qd2jw.firebaseapp.com",
  projectId: "modular-vine-qd2jw",
  storageBucket: "modular-vine-qd2jw.firebasestorage.app",
  messagingSenderId: "75261096131",
  appId: "1:75261096131:web:68eafbb64774fb169eb276"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with the specific custom database ID for AI Studio
const db = getFirestore(app, "ai-studio-veloraai-fe5efc9b-c525-4e9c-b4bd-ad55035967ec");

export { app, auth, db, googleProvider };
