const firebaseConfig = {
  apiKey: "AIzaSyAkMccaMDOUcSrM7WcjwVZ3LP8rdWI1NAA",
  authDomain: "budgetplanner-952e3.firebaseapp.com",
  projectId: "budgetplanner-952e3",
  storageBucket: "budgetplanner-952e3.firebasestorage.app",
  messagingSenderId: "491817221899",
  appId: "1:491817221899:web:17352c66098004772b2c0e",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Auth
const auth = firebase.auth();

// Google Sign-In
const signInButton = document.getElementById("signIn");
signInButton.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      console.log("Signed in as:", user.email);
      window.location.href = "/index.html"; // Redirect on success
    })
    .catch(error => {
      console.error("Sign-in error:", error.message);
    });
});
