// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Hw6JFj8Pr-gT3GaDljGO7vG1D57e--I",
  authDomain: "gogreenproject-f7bf2.firebaseapp.com",
  projectId: "gogreenproject-f7bf2",
  storageBucket: "gogreenproject-f7bf2.appspot.com",
  messagingSenderId: "1053967386781",
  appId: "1:1053967386781:web:2889b8e5983740262cac74",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Export firestore database
// Imported into app whenever it's needed
export const db = getFirestore(firebaseApp);

export const usersRef = collection(db, "users"); // reference to users collection in firestore

// Reference to a specific user's "children" collection
export const childrenRef = (user) => {
  // Check if user is not null and has the 'uid' property
  if (user && user.uid) {
    return collection(usersRef, doc(db, "users", user.uid), "children");
  } else {
    console.error("Invalid user or user ID is missing.");
    return null;
  }
};

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(firebaseApp);
