import React from "react";
import "./LandingPage.css";
// Import the background image
import bgSection1 from "/src/assets/landing-bg-section1.jpg";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="fullscreen-bg">
        <img src={bgSection1} alt="Ocean Background" />
      </div>
      <div className="content">
        <div className="header-text">
          <h1 className="title">Low-Poly Ocean</h1>
          <p className="subtitle">โลกในอีกมุมที่คุณไม่เคยเห็น</p>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow-down">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M12 19L19 12M12 19L5 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
