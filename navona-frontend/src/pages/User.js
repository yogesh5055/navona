import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/User.css";
 
const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchUserDetails();

    // Prevent back navigation by pushing a new state
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      navigate("/user", { replace: true }); // Redirect to /user without adding to history
      window.history.pushState(null, "", window.location.href); // Push again to prevent back
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="user-page">
      <nav className="navbar">
        <div className="user-profile" onClick={togglePopup}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="user"
          />
        </div>
      </nav>

      {showPopup && user && (
        <div className="popup">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      <div className="content">
        <h1>Build Your Custom Roadmap 🚀</h1>
        <p>Get a step-by-step learning path tailored to your goal.</p>
        <button className="generate-btn" onClick={() => navigate("/roadmap")}>
          Generate Your Roadmap 🚀
        </button>
      </div>
    </div>
  );
};

export default User;
