import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Error.css';

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1 className="glitch">404</h1>
      <p>Page Not Found 😕</p>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Error;
