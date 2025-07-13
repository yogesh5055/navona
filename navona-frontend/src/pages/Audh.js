import React from 'react';
import '../styles/Loading.css';

const Auth = () => {
  return (
    <div className="loading-container">
      <h1>Authenticating, please wait...</h1>
      <div className="neon-ring"></div>
    </div>
  );
};

export default Auth;