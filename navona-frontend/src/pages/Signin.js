import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signin.css";
 
const Signin = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", email: "", password: "", confirmPassword: "", termsAccepted: false });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({ ...userData, [name]: type === "checkbox" ? checked : value });
  };

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!isStrongPassword(userData.password)) {
      setError("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    if (!userData.termsAccepted) {
      setError("You must accept the Terms & Conditions.");
      return;
    }

    setError("");
    navigate("/auth"); // ✅ Redirect to loading page before making the request

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        navigate("/signup"); // ✅ Redirect back if signup fails
        throw new Error(data.detail || "Registration failed!");
      }

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      navigate("/user"); // ✅ Redirect to user dashboard after successful signup
    } catch (error) {
      navigate("/signup"); // ✅ Redirect back on error
      setError(error.message);
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up to Navona 🚀</h1>
        <input type="text" name="username" placeholder="Username" value={userData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} required />
        <div className="terms">
          <input type="checkbox" name="termsAccepted" checked={userData.termsAccepted} onChange={handleChange} />
          <span>I accept the <a href="/terms">Terms & Conditions</a></span>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="signup-btn">Sign Up 🚀</button>
        <p className="signin-link">Already have an account? <span onClick={() => navigate("/login")}>Log In</span></p>
      </form>
    </div>
  );
};

export default Signin;
