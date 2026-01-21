import React from "react";
import "./LandingPage.css";
// Import the background image
import bgSection1 from "/src/assets/landing-bg-section1.jpg";
import bgSection2 from "/src/assets/landing-bg-section2.png";
import bgOverlaySection2 from "/src/assets/landing-bg-overlay-section2.png";
import floatingGroup from "/src/assets/floating-group-section2.png";
import { ANIMALS } from "../data/animalConfig";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Section 1 */}
      <section className="section-1">
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
      </section>

      {/* Section 2 */}
      <section className="section-2">
        <img
          src={bgSection2}
          alt="Deep Ocean Background"
          className="bg-section-2"
        />

        {/* Overlay Image (Above BG, Below Bubbles) */}
        <img
          src={bgOverlaySection2}
          alt="Ocean Overlay"
          className="bg-overlay-section-2"
        />

        <div className="bubbles">
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
          <span className="bubble"></span>
        </div>

        {/* Floating Decoration */}
        <div className="floating-decor">
          <img src={floatingGroup} alt="Floating Decoration" />
        </div>

        {/* Polygon Orca (Floating) */}
        <div className="orca-container floating-decor-orca">
          <div className="orca-wrapper">
            {ANIMALS.find((a) => a.id === "orca")?.shards.map(
              (shard, index) => {
                // Extract the first X coordinate from clipPath string (e.g. "80%")
                // Format: polygon(X% Y%, ...)
                const match = shard.clipPath.match(/polygon\(\s*([\d.]+)%/);
                const xPercent = match ? parseFloat(match[1]) : 50;
                // Normalize 0-100 to 0-1
                const xPos = xPercent / 100;

                return (
                  <div
                    key={index}
                    className="shard"
                    style={{
                      clipPath: shard.clipPath,
                      backgroundColor: shard.color,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      // Pass X position for wave animation delay
                      "--x-pos": xPos,
                    }}
                  />
                );
              },
            )}
          </div>
        </div>

        <div className="content">
          {/* Content for Section 2 will go here */}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
