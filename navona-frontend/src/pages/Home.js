import React from "react";
import "../styles/Home.css"; 
import { Link } from "react-router-dom";// Import global styles

const Home = () => {
  return (
   <div className="container">
      {/* Navbar for Sign In & Login */}
      <nav className="navbar">
        <Link to="/notallowed" className="auth-button">Sign Up</Link>
        <Link to="/login" className="auth-button">Login</Link>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1>Welcome to <span className="highlight">navona</span>.ai</h1>
        <p>Your AI-powered roadmap generator for learning & growth.</p>
        <Link to="/login">
          <button className="cta-button">Get Started 🚀</button>
        </Link>
      </header>
      <div className="particles">
    {[...Array(20)].map((_, i) => (
    <span key={i} style={{
      top: Math.random() * 100 + "vh",
      left: Math.random() * 100 + "vw",
      animationDelay: Math.random() * 5 + "s"
    }}></span>
  ))}
</div>

    </div>
  );
};

export default Home;
