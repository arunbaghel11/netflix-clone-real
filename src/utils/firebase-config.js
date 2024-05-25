// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyAlSxzS6ynbE7DL2q1rlNSWzjs2Pw2GKjQ",
  authDomain: "netflix-clone-4edda.firebaseapp.com",
  projectId: "netflix-clone-4edda",
  storageBucket: "netflix-clone-4edda.appspot.com",
  messagingSenderId: "688817805708",
  appId: "1:688817805708:web:7ba3326a869363559cdea9",
  measurementId: "G-QPS3E009PG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app); 