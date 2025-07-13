import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Notallow.css';

const Notallow = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div className="not-allowed-page">
      <div className="not-allowed-box">
        <h1>Account Creation Not Available 🚫</h1>
        <p>
          We're currently not allowing new account creation. <br />
          If you're genuinely interested in using this model, please reach out to us at: <br />
          <strong><a href="mailto:yogeshwaran5055@gmail.com">yogeshwaran5055@gmail.com</a></strong>
        </p>
        <p className="thanks-message">Thank you for your interest in Navona! ✨</p>
        
        <button className="back-btn" onClick={handleBack}>← Back</button>
      </div>
    </div>
  );
};

export default Notallow;
