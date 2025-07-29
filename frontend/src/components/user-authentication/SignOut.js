import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and session data
    localStorage.removeItem("token");
    localStorage.removeItem("current-user");
    localStorage.setItem("isLoggedIn", "false");

    toast.success("You have been logged out!");

    // Redirect to sign-in page after a short delay
    setTimeout(() => {
      navigate("/sign-in");
    }, 1000);
  }, [navigate]);

  return null; // Optional: You could show a loader or message if you want
}

export default Logout;
