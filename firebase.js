// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARodTp6kUIp8F-tzDA_VVvLWNCUM6IddE",
  authDomain: "flashcards-saas-cb349.firebaseapp.com",
  projectId: "flashcards-saas-cb349",
  storageBucket: "flashcards-saas-cb349.appspot.com",
  messagingSenderId: "913458502025",
  appId: "1:913458502025:web:06428ba804e556ba01e958",
  measurementId: "G-BLLBYBWXPT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export { db } ;