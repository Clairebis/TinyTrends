// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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
const app = initializeApp(firebaseConfig);

// Export firestore database
// Imported into app whenever it's needed
export const db = getFirestore(app);
