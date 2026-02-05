import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ANIMALS } from "../data/animalConfig";
import UnderwaterEnvironment from "../components/UnderwaterEnvironment";
import "./LandingPageVer2.css";
import topSceneOverlay from "/src/assets/top-scene.svg";
import middleSceneOverlay from "/src/assets/middle-scene.svg";
import middleLeftSceneOverlay from "../assets/middle-left-scene.svg";
import middleRightSceneOverlay from "../assets/middle-right-scene.svg";
import bottomLeftSceneOverlay from "../assets/bottom-left-scene.svg";
import bottomRightSceneOverlay from "../assets/bottom-right-scene.svg";

// --- Parallax Helper Component ---
// This component detects when it enters the viewport and applies parallax effect.
// Range Y/X: ["StartValue", "EndValue"]
// StartValue: Value when element ENTER viewport (bottom of screen)
// EndValue: Value when element LEAVE viewport (top of screen)
const ParallaxElement = ({
  children,
  yRange = ["0%", "0%"],
  xRange = ["0%", "0%"],
  opacityRange,
  opacityInputRange,
  offset = ["start end", "end start"],
  className = "",
  style = {},
}) => {
  const ref = useRef(null);
  // Default offset: start end -> end start handles the full visual lifecycle of the element in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset,
  });

  // Use spring for smoothing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Helper to determine input range based on output keyframes
  // If 3 values provided: [Start, Center, End] -> Map to [0, 0.5, 1]
  const getInputRange = (range) => (range.length === 3 ? [0, 0.5, 1] : [0, 1]);

  const y = useTransform(smoothProgress, getInputRange(yRange), yRange);
  const x = useTransform(smoothProgress, getInputRange(xRange), xRange);

  // Optional opacity transform if opacityRange is provided
  // Allow manual override with opacityInputRange, or default to standard mapping
  const opacityInput =
    opacityInputRange ||
    (opacityRange && opacityRange.length === 3 ? [0, 0.5, 1] : [0, 1]);
  const finalOpacity = opacityRange
    ? useTransform(smoothProgress, opacityInput, opacityRange)
    : undefined;

  return (
    <motion.div
      ref={ref}
      style={{ position: "relative", y, x, opacity: finalOpacity, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const LandingPageVer2 = () => {
  // Global scroll for Bubbles (to avoid ref/position issues on full-page element)
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Header Text Animations (Global Scroll to ensure perfect stickiness at top)
  // Move down 1px for every 1px scrolled (y=scrollY) to appear fixed
  // Extended range to 5000 to ensure it sticking until fade out point (regardless of where that is)
  const headerY = useTransform(smoothScrollY, [0, 5000], [0, 5000]);
  // Instant fade out at the point defined (currently 1200 as per user edit)
  const headerOpacity = useTransform(smoothScrollY, [0, 1200, 1201], [1, 1, 0]);

  return (
    <div className="landing-page-v2">
      <div className="landing-bg">
        <UnderwaterEnvironment />
      </div>

      <div className="global-scene-layer-v2">
        {/* Place continuous background scene images here */}
      </div>

      <section className="section-1-v2">
        <motion.div
          className="content-v2"
          style={{
            gridArea: "stack",
            y: headerY,
            opacity: headerOpacity,
          }}
        >
          <div className="header-text-v2">
            <h1 className="title-v2">Low-Poly Ocean</h1>
            <p className="subtitle-v2">โลกในอีกมุมที่คุณไม่เคยเห็น</p>
          </div>

          <div className="scroll-indicator-v2">
            <div className="mouse-v2">
              <div className="wheel-v2"></div>
            </div>
            <div className="arrow-down-v2">
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
        </motion.div>

        <ParallaxElement
          yRange={["0%", "-10%"]}
          style={{
            gridArea: "stack",
            width: "100%",
            height: "auto",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <img
            src={topSceneOverlay}
            className="top-scene-overlay-v2"
            alt=""
            style={{ width: "100%" }}
          />
        </ParallaxElement>
      </section>

      <section className="section-irrawaddy-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Reduced contrast between fast/slow phase
          xRange={["30%", "0%", "-5%"]}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="irrawaddy-dolphin-v2">
            <div className="irrawaddy-wrapper-v2">
              {ANIMALS.find((a) => a.id === "irrawaddyDolphin")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-dolphin-standard-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide in & Drift
          xRange={["-30%", "0%", "5%"]} // From Left -> Center -> Drift Right
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div className="dolphin-standard-v2">
            <div className="dolphin-wrapper-standard-v2">
              {ANIMALS.find((a) => a.id === "dolphin")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-stingray-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["30%", "0%", "-5%"]} // Enter from Right
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="stingray-v2">
            <div className="stingray-wrapper-v2">
              {ANIMALS.find((a) => a.id === "stingray")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-dugong-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "5%"]} // Enter from Left
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="dugong-v2">
            <div className="dugong-wrapper-v2">
              {ANIMALS.find((a) => a.id === "dugong")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-middle-scene-v2">
        <ParallaxElement
          yRange={["10%", "-20%"]} // Slower movement for background rock
          style={{
            width: "100%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <img
            src={middleSceneOverlay}
            className="middle-scene-overlay-v2"
            alt=""
            style={{ display: "block", width: "100%" }}
          />
        </ParallaxElement>

        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Vertical Slide & Drift
          xRange={["0%", "0%", "0%"]} // Center vertical movement
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <div className="turtle-v2">
            <div className="turtle-wrapper-v2">
              {ANIMALS.find((a) => a.id === "turtle")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-ronin-v2">
        <ParallaxElement
          yRange={["0%", "-15%"]}
          xRange={["-20%", "0%"]}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "45%",
            zIndex: 6,
          }}
        >
          <img
            src={middleLeftSceneOverlay}
            className="mid-left-scene-v2"
            alt=""
            style={{
              position: "relative",
              top: "auto",
              left: "auto",
              width: "100%",
            }}
          />
        </ParallaxElement>

        <ParallaxElement
          yRange={["0%", "-15%"]}
          xRange={["20%", "0%"]}
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: "40%",
            zIndex: 6,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src={middleRightSceneOverlay}
            className="mid-right-scene-v2"
            alt=""
            style={{
              position: "relative",
              top: "auto",
              right: "auto",
              width: "100%",
            }}
          />
        </ParallaxElement>

        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["30%", "0%", "-5%"]} // Enter from Right
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="ronin-v2">
            <div className="ronin-wrapper-v2">
              {ANIMALS.find((a) => a.id === "ronin")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>

        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "5%"]} // Enter from Left
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="sawfishes-v2">
            <div className="sawfishes-wrapper-v2">
              {ANIMALS.find((a) => a.id === "sawfishes")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-orca-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["30%", "0%", "-5%"]} // Enter from Right
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="orca-v2">
            <div className="orca-wrapper-v2">
              {ANIMALS.find((a) => a.id === "orca")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-sperm-whale-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "5%"]} // Enter from Left
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="sperm-whale-v2">
            <div className="sperm-whale-wrapper-v2">
              {ANIMALS.find((a) => a.id === "spermWhale")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-blue-whale-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Vertical Slide & Drift
          xRange={["0%", "0%", "0%"]} // Center vertical
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="blue-whale-v2">
            <div className="blue-whale-wrapper-v2">
              {ANIMALS.find((a) => a.id === "blueWhale")?.shards.map(
                (shard, index) => (
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
                    }}
                  />
                ),
              )}
            </div>
          </div>
        </ParallaxElement>
      </section>

      <section className="section-bottom-scene-v2">
        <ParallaxElement
          yRange={["0%", "-10%"]}
          xRange={["-20%", "0%"]}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "30%",
            height: "auto",
            zIndex: 20,
          }}
        >
          <img
            src={bottomLeftSceneOverlay}
            className="bottom-left-scene-v2"
            alt=""
            style={{
              position: "relative",
              pointerEvents: "none",
              width: "100%",
            }}
          />
        </ParallaxElement>

        <ParallaxElement
          yRange={["0%", "-10%"]}
          xRange={["20%", "0%"]}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "30%",
            height: "auto",
            zIndex: 20,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <img
            src={bottomRightSceneOverlay}
            className="bottom-right-scene-v2"
            alt=""
            style={{
              position: "relative",
              pointerEvents: "none",
              width: "100%",
            }}
          />
        </ParallaxElement>
      </section>
    </div>
  );
};

export default LandingPageVer2;
