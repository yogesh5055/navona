import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
 
const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/auth"); // ✅ Redirect to loading page before making the request

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(userData),
});


      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token); // ✅ Store token
        navigate("/user"); // ✅ Redirect to user dashboard
      } else {
        const errorData = await response.json();
        navigate("/login"); // ✅ Redirect back to login if error occurs
        setError(errorData.detail);
      }
    } catch (error) {
      navigate("/login"); // ✅ Redirect back if network error
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h1>Login to Navona 🚀</h1>
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">Login 🚀</button>
        <p className="signup-link">Don't have an account? <span onClick={() => navigate("/notallowed")}>Sign Up</span></p>
      </form>
    </div>
  );
};

export default Login;
