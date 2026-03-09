import React from "react";
import "./Intro1.css";

const Intro1 = ({ onNext }) => {
  return (
    <div className="intro1-overlay" onClick={onNext}>
      <div className="bubbles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="polygon-bubble"></div>
        ))}
      </div>
      <div className="intro1-content">
        <div className="main-bubble">
          <div className="bubble-highlight-sharp"></div>
          <div className="bubble-glow-internal"></div>
          <h1 className="explore-text">เริ่มสำรวจ</h1>
        </div>
      </div>
    </div>
  );
};

export default Intro1;
