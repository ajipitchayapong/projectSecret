import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import "./LandingPage.css";
// Import the background image
import bgSection1 from "/src/assets/landing-bg-section1.webp"; // Restore missing bgSection1
import layerBack from "/src/assets/1.webp";
import layerFront from "/src/assets/2.webp";
import floatingGroup from "/src/assets/floating-group-section2.png";
import { ANIMALS } from "../data/animalConfig";

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();

  // Add spring physics for smoothing (Critical for "slippery/smooth" feel)
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // --- Parallax Transforms ---

  // Section 1 Background: Static
  const bg1Y = useTransform(smoothScrollY, [0, 1000], ["0%", "0%"]);

  // Section 1 Text: Moves slower
  const text1Y = useTransform(smoothScrollY, [0, 500], ["0%", "50%"]);
  const text1Opacity = useTransform(smoothScrollY, [0, 400], [1, 0]);

  // Section 2 Parallax
  // Background: Far away, massive, moves slowly. Starts higher (-10%) to overlap section 1 better
  const bg2Y = useTransform(smoothScrollY, [500, 1500], ["-10%", "5%"]);

  // --- Layer Transforms (Horizontal & Vertical) ---
  // Layer 1 (Back)
  const layerBackY = useTransform(smoothScrollY, [200, 1000], ["0%", "-10%"]);
  const layerBackX = useTransform(smoothScrollY, [200, 1000], ["0%", "-15%"]); // แก้ค่าตรงนี้เพื่อเลื่อนแนวนอน

  // Layer 2 (Front - formerly Mid)
  const layerFrontY = useTransform(smoothScrollY, [200, 1000], ["0%", "-10%"]);
  const layerFrontX = useTransform(smoothScrollY, [200, 1000], ["0%", "15%"]); // แก้ค่าตรงนี้เพื่อเลื่อนแนวนอน

  // Floating Decor: Closer, moves significantly against scroll
  const floatDecorY = useTransform(smoothScrollY, [500, 1500], ["10%", "-20%"]);

  // Orca: Interactive, swims against scroll
  const orcaY = useTransform(smoothScrollY, [500, 1500], ["10%", "-25%"]);
  const orcaX = useTransform(smoothScrollY, [500, 1500], ["0%", "5%"]);

  // Bubbles: Foreground, fast lift
  const bubbleY = useTransform(smoothScrollY, [0, 2000], ["0%", "-80%"]);

  return (
    <div className="landing-page" ref={containerRef}>
      {/* Section 1 */}
      <section className="section-1">
        <motion.div className="fullscreen-bg" style={{ y: bg1Y }}>
          <img
            src={bgSection1}
            alt="Ocean Background"
            className="bg-section-1"
          />
        </motion.div>

        <motion.div
          className="content"
          style={{ y: text1Y, opacity: text1Opacity }}
        >
          <div className="header-text">
            <h1 className="title">Low-Poly Ocean</h1>
            <p className="subtitle">โลกในอีกมุมที่คุณไม่เคยเห็น</p>
          </div>
        </motion.div>
      </section>

      {/* Section 2 */}
      <section className="section-2">
        <motion.div
          className="bg-section-2-wrapper"
          style={{
            position: "absolute",
            top: "-10%",
            left: 0,
            width: "100%",
            height: "120%",
            y: bg2Y,
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(180deg, #040F2B 0%, rgba(4, 15, 43, 0.00) 100%), radial-gradient(50% 50% at 50% 50%, #06194A 0%, #040F2B 100%)",
            }}
          />
        </motion.div>

        {/* --- Parallax Layers (Custom Configuration) --- */}

        {/* Layer 1: Background Rocks (1.png) */}
        <motion.img
          src={layerBack}
          alt="Ocean Back Layer"
          className="parallax-layer layer-back"
          style={{ y: layerBackY, x: layerBackX }}
        />

        {/* Layer 2: Midground (2.webp) */}
        <motion.img
          src={layerFront}
          alt="Ocean Front Layer"
          className="parallax-layer layer-front"
          style={{ y: layerFrontY, x: layerFrontX }}
        />

        {/* Layer 3 Removed as requested */}

        {/* Bubbles (Existing) */}
        <motion.div className="bubbles" style={{ y: bubbleY }}>
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
        </motion.div>

        {/* Floating Decoration */}
        <motion.div className="floating-decor" style={{ y: floatDecorY }}>
          <img src={floatingGroup} alt="Floating Decoration" />
        </motion.div>

        {/* Polygon Orca (Floating) */}
        <motion.div
          className="orca-container floating-decor-orca"
          style={{ y: orcaY, x: orcaX }}
        >
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
        </motion.div>
      </section>

      <motion.div
        className="scroll-indicator"
        style={{ opacity: text1Opacity }}
      >
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
      </motion.div>
    </div>
  );
};

export default LandingPage;
// Forced rebuild
