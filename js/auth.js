// Ensure firebase-config.js is loaded first via the HTML script tags

const signInButton = document.getElementById("signIn");

signInButton.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      alert(`Signed in as ${user.displayName}`);
      console.log("User Info:", user);
      // Redirect or load the next page
      window.location.href = "index.html";
    })
    .catch(error => {
      console.error("Error during sign-in:", error);
      alert("Sign-in failed. Check the console for details.");
    });
});
