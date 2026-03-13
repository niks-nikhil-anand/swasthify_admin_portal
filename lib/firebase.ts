import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const identityConfig = {
    apiKey: process.env.NEXT_PUBLIC_MOBILE_AUTH_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_MOBILE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_MOBILE_AUTH_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_MOBILE_AUTH_STORAGE_BUCKET,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Identity Platform App
const identityApp = getApps().find(a => a.name === "identity") 
    || initializeApp(identityConfig, "identity");
const identityAuth = getAuth(identityApp);

const googleProvider = new GoogleAuthProvider();

export { app, auth, identityApp, identityAuth, googleProvider };
