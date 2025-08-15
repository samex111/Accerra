import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJE9Ug8_39UXW3d06ncMZGJZleLves-cQ",
  authDomain: "accerra-858a5.firebaseapp.com",
  projectId: "accerra-858a5",
  storageBucket: "accerra-858a5.appspot.com", 
  messagingSenderId: "970654110203",
  appId: "1:970654110203:web:5010a7d792f8f020a4bb5e",
  measurementId: "G-96HSPT12N2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
