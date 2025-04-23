import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDy0BFMfyMERGu8a0toZBbFfN_K1jetn14",
    authDomain: "memestock-591b0.firebaseapp.com",
    projectId: "memestock-591b0",
    storageBucket: "memestock-591b0.firebasestorage.app",
    messagingSenderId: "759309128644",
    appId: "1:759309128644:web:537b97bf1787ba1ab18a91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

