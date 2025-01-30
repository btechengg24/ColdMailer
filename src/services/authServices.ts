import app from "../Firebase/config";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth"; // Import inside the service

const auth = getAuth(app); // Initialize Firebase Authentication
const googleProvider = new GoogleAuthProvider(); // Google OAuth provider

// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log("User signed in signInWithGoogle");
    
    return userCredential;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    return null;
  }
};

// Sign out the user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
