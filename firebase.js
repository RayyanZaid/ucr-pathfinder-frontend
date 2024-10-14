// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Signed in successfully:", userCredential.user);

    if (!userCredential.user.emailVerified) {
      console.log(
        "Email not verified. Please verify your email before signing in."
      );
      throw new Error(
        "Email not verified. Please verify your email before signing in."
      );
    }

    return userCredential; // Successfully signed in
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error; // Propagate the error if needed
  }
};

const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(userCredential.user);
    console.log("Verification email sent.");
    return userCredential;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const deleteUserAccount = async () => {
  try {
    const user = auth.currentUser; // Get the currently signed-in user
    if (!user) {
      throw new Error("No user is currently signed in.");
    }

    await deleteUser(user); // Delete the user account
    console.log("User account deleted successfully.");

    await signOut(auth); // Optionally, sign out the user
    console.log("User signed out.");
  } catch (error) {
    console.error("Error deleting user account:", error.message);
    throw error;
  }
};

export { signInUser, signUpUser, deleteUserAccount };
