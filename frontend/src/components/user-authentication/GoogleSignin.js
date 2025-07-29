import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auths, googleProvider } from "../firebase"; // adjust path to your firebase.js

const GoogleSigninButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      // Firebase popup
      const result = await signInWithPopup(auths, googleProvider);
      const user = result.user;

      // Secure ID token (JWT signed by Firebase)
      const idToken = await user.getIdToken(); // <--- IMPORTANT

      // Send *only token* to backend; backend will verify & fetch claims.
      const response = await fetch("http://localhost:5000/user/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }), // secure!
      });

      const data = await response.json();
      console.log("Firebase login backend response:", data);

      if (!data.success) {
        console.error("Firebase login failed:", data.message);
        return;
      }

      // Save session (app JWT from backend)
      localStorage.setItem("token", data.token);
      localStorage.setItem("current-user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "/";
    } catch (err) {
      console.error("Google Sign-in Error:", err);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default GoogleSigninButton;
