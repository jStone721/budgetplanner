import {auth} from "./firebase-config.js";
import {signInWithPopup, GoogleAuthProvider} from "./firebase/firebase-auth.js";

const provider = new GoogleAuthProvider();

const signInBttn = document.getElementById("signIn");

const signIn = (auth, provider) => {
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      localStorage.setItem("email", JSON.stringify(user.email));
      window.location = "index.html";
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
};

signInBttn.addEventListener("click", () => {
  signIn(auth, provider);
});
