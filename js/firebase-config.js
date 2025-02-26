// Import the functions you need from the SDKs you need
// import {initializeApp} from "firebase/app";
// import {getFirestore} from "firebase/firestore";
// import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkMccaMDOUcSrM7WcjwVZ3LP8rdWI1NAA",
  authDomain: "budgetplanner-952e3.firebaseapp.com",
  projectId: "budgetplanner-952e3",
  storageBucket: "budgetplanner-952e3.firebasestorage.app",
  messagingSenderId: "491817221899",
  appId: "1:491817221899:web:17352c66098004772b2c0e",
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
