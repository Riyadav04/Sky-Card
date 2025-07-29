import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Apis from "../../Apis";

const Header = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const [cardCount, setCardCount] = useState(0);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("current-user");
    localStorage.removeItem("isLoggedIn");
    toast.success("You have been logged out successfully.");
    navigate("/sign-in");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch user profile
    axios
      .get(Apis.GET_USER_PROFILE, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const pic = res.data.user?.profilePic;
        setProfilePic(
          pic && pic !== "undefined" && pic !== ""
            ? `${Apis.BASE_URL}/uploads/${pic}`
            : ""
        );
      })
      .catch((err) => console.error("Profile fetch error:", err));

    // Fetch user's cards
    axios
      .get(Apis.GET_MY_CARDS, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCardCount(res.data.cards?.length || 0))
      .catch((err) => console.error("Card fetch error:", err));
  }, []);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">
          <img src="/images/sky_logo.png" alt="Sky" style={{ width: "50px", height: "40px" }} />
        </div>
        <nav className="nav-links">
          <Link className="link" to="/">Home</Link>
          <Link className="link" to="/select-card">Cards</Link>
          {/* <Link className="link" to="/my-cards">My Cards</Link> */}
          <Link className="link" to="/contact">Contact Us</Link>
          <Link className="link" to="/about">About Us</Link>
        </nav>
      </div>

      <div className="auth-buttons">
        {!isLoggedIn ? (
          <>
            <Link to="/sign-up"><button className="signup-bt link">Sign-up</button></Link>
            <Link to="/sign-in"><button className="login-btn link">Sign-in</button></Link>
          </>
        ) : (
          <div className="profile-actions">
            <Link to="/user-profile">
              <img
                src={profilePic || "/images/default-user.png"}
                alt="User"
                className="user-profile-pic"
                onError={(e) => (e.target.src = "/images/default-user.png")}
              />
            </Link>
            <button onClick={handleSignout} className="logout-button">Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
