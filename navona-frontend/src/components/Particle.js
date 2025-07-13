import React from "react";
import "../styles/Particle.css"; // Add CSS for particles

const Particle = () => {
  return (
    <div className="particles">
      {[...Array(30)].map((_, i) => (
        <span
          key={i}
          style={{
            top: Math.random() * 100 + "vh",
            left: Math.random() * 100 + "vw",
            animationDuration: Math.random() * 5 + 5 + "s",
          }}
        ></span>
      ))}
    </div>
  );
};

export default Particle;
