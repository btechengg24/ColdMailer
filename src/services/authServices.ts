import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential,
} from "firebase/auth";

import app from "../Firebase/config";

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google OAuth provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/gmail.send");

// Store the entire UserCredential object
const storeUserCredential = (userCredential: UserCredential) => {
  localStorage.setItem("googleUserCredential", JSON.stringify(userCredential));
};

// Retrieve stored UserCredential
const getStoredUserCredential = (): UserCredential | null => {
  const userData = localStorage.getItem("googleUserCredential");
  return userData ? (JSON.parse(userData) as UserCredential) : null;
};

// Clear stored UserCredential
const clearStoredUserCredential = () => {
  localStorage.removeItem("googleUserCredential");
};

// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log("User signed in signInWithGoogle");

    storeUserCredential(userCredential);

    // const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    // if (!credential) throw new Error("No credential found");

    return userCredential;
  } catch (error) {
    console.error("Error signing in signInWithGoogle", error);
    return null;
  }
};

// Sign out the user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out.");
    clearStoredUserCredential();
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

// Get the currently stored user from credentials
export const getCurrentUser = () => {
  const storedCredential = getStoredUserCredential();
  return storedCredential?.user || null;
};

// Get the OAuth access token when needed
export const getGoogleAccessToken = async (): Promise<string | null> => {
  const storedCredential = getStoredUserCredential();

  if (!storedCredential) {
    console.log("No stored credentials. Signing in again...");

    const userCredential = await signInWithGoogle();
    if (!userCredential) return null;

    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    return credential?.accessToken || null;
  }

  // Try extracting access token from stored credentials
  const credential = GoogleAuthProvider.credentialFromResult(storedCredential);
  return credential?.accessToken || null;
};
