// Initialize Firebase using the global 'firebase' object provided by CDN

const firebaseConfig = {
  apiKey: "AIzaSyAkMccaMDOUcSrM7WcjwVZ3LP8rdWI1NAA",
  authDomain: "budgetplanner-952e3.firebaseapp.com",
  projectId: "budgetplanner-952e3",
  storageBucket: "budgetplanner-952e3.appspot.com",
  messagingSenderId: "491817221899",
  appId: "1:491817221899:web:17352c66098004772b2c0e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
