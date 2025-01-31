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

let accessToken: string | undefined;
// Sign in with Google OAuth
export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    console.log("User signed in signInWithGoogle");

    const credential = GoogleAuthProvider.credentialFromResult(userCredential);
    if (!credential) throw new Error("No credential found");

    accessToken = credential.accessToken; // ✅ Get OAuth token
    console.log("Google OAuth Access Token:", accessToken);

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

// Get the current authenticated user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Fetch the current access token
export const getAccessToken = async (): Promise<string | null> => {
  const user = getCurrentUser();

  if (!user) {
    console.error("No user signed in.");
    return null;
  }
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting access token: ", error);
    return null;
  }
};

// Fetch the OAuth access token for Gmail API
export const getGoogleAccessToken = async () => {
  return accessToken;
};
