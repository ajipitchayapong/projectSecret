import React, { useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ANIMALS } from "../data/animalConfig";
import ANIMAL_DETAILS from "../data/animalDetails.json";
import UnderwaterEnvironment from "../components/UnderwaterEnvironment";
import SoundController from "../components/SoundController";
import BackToTop from "../components/BackToTop";
import "../components/SoundController.css";
import "./Landing.css";
import topSceneOverlay from "/src/assets/top-scene.svg";
import middleSceneOverlay from "/src/assets/middle-scene.svg";
import middleLeftSceneOverlay from "../assets/middle-left-scene.svg";
import middleRightSceneOverlay from "../assets/middle-right-scene.svg";
import bottomLeftSceneOverlay from "../assets/bottom-left-scene.svg";
import bottomRightSceneOverlay from "../assets/bottom-right-scene.svg";
import bgSound from "../assets/sound/bg-sound.MP3";

// --- Parallax Helper Component ---
// This component detects when it enters the viewport and applies parallax effect.
// Range Y/X: ["StartValue", "EndValue"]
// StartValue: Value when element ENTER viewport (bottom of screen)
// EndValue: Value when element LEAVE viewport (top of screen)
const ParallaxElement = ({
  children,
  yRange = ["0%", "0%"],
  xRange = ["0%", "0%"],
  scaleRange,
  rotateRange,
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
  const scale = scaleRange
    ? useTransform(smoothProgress, getInputRange(scaleRange), scaleRange)
    : undefined;
  const rotate = rotateRange
    ? useTransform(smoothProgress, getInputRange(rotateRange), rotateRange)
    : undefined;

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
      style={{
        position: "relative",
        y,
        x,
        scale,
        rotate,
        opacity: finalOpacity,
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AnimalInfoBox = ({
  animalId,
  align = "left",
  isOpaque = false,
  className = "",
}) => {
  const details = ANIMAL_DETAILS.animals.find((a) => a.id === animalId);
  if (!details) return null;

  return (
    <ParallaxElement
      yRange={["20%", "0%", "-5%"]}
      opacityRange={[0, 1, 1]}
      className={`animal-info-box-v2 ${align} ${className}`}
      style={{ position: "absolute" }}
    >
      <div className={`info-content-v2 ${isOpaque ? "opaque-v2" : ""}`}>
        <h3 className="info-name-v2">
          {details.nameEN}{" "}
          <span className="name-th-v2">| {details.nameTH}</span>
        </h3>
        <p className="info-desc-v2">{details.content.intro}</p>
        <Link to={`/explore?id=${animalId}`} className="detail-btn-v2">
          เรียนรู้เพิ่มเติม
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </ParallaxElement>
  );
};

const LightRays = () => {
  return (
    <div className="light-rays-container-v2">
      <div className="light-ray-v2 r1"></div>
      <div className="light-ray-v2 r2"></div>
      <div className="light-ray-v2 r3"></div>
      <div className="light-ray-v2 r4"></div>
      <div className="light-ray-v2 r5"></div>
    </div>
  );
};

const MarineSnow = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 10,
        duration: Math.random() * 15 + 20,
      })),
    [],
  );

  return (
    <div className="marine-snow-container-v2">
      {particles.map((p) => (
        <div
          key={p.id}
          className="snow-particle-v2"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const DepthIndicator = () => {
  const { scrollYProgress } = useScroll();
  const depth = useTransform(scrollYProgress, [0, 1], [0, 2000]); // Map 0-1 progress to 0-2000m
  const roundedDepth = useSpring(depth, { stiffness: 100, damping: 30 });

  return (
    <div className="depth-indicator-v2">
      <div className="depth-ruler-v2">
        <div className="ruler-mark-v2">0m</div>
        <div className="ruler-mark-v2">500m</div>
        <div className="ruler-mark-v2">1000m</div>
        <div className="ruler-mark-v2">1500m</div>
        <div className="ruler-mark-v2">2000m</div>
      </div>
      <motion.div className="depth-value-v2">
        <motion.span>
          {useTransform(roundedDepth, (v) => Math.round(v))}
        </motion.span>
        <span className="unit-v2">m</span>
      </motion.div>
    </div>
  );
};

let hasAppInitialized = false;

const Landing = () => {
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

  const location = useLocation();

  // --- Intro Overlay State ---
  // We use a module-level variable 'hasAppInitialized' to check if this is a fresh page load.
  // - On F5 (refresh) or direct visit: the JS environment is brand new, hasAppInitialized is false.
  // - On SPA navigation (clicking Back from /explore, or using a Link): the JS environment is preserved, hasAppInitialized is true.
  const [showIntro, setShowIntro] = useState(() => {
    if (!hasAppInitialized) {
      hasAppInitialized = true;
      return true; // Show intro on fresh load
    }

    // We came back from another page in the app, so hide the intro
    return false;
  });

  const introParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      initialX: `${Math.random() * 100}%`,
      initialY: `${Math.random() * 100 + 100}%`,
      initialScale: Math.random() * 0.5 + 0.5,
      animX1: `${Math.random() * 100}%`,
      animX2: `${Math.random() * 100 + (Math.random() * 20 - 10)}%`,
      duration: 8 + Math.random() * 7,
      delay: Math.random() * 5,
    }));
  }, []);

  const startExperience = () => {
    if (window.triggerSoundPlay) {
      window.triggerSoundPlay();
    }
    setShowIntro(false);
  };

  return (
    <div className="landing-page-v2">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(20px)",
              transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Bioluminescent Particles for Wow Factor */}
            <div className="intro-particles">
              {introParticles.map((p) => (
                <motion.div
                  key={p.id}
                  className="intro-particle"
                  initial={{
                    x: p.initialX,
                    y: p.initialY,
                    opacity: 0,
                    scale: p.initialScale,
                  }}
                  animate={{
                    y: "-20vh",
                    opacity: [0, 0.8, 0],
                    x: [p.animX1, p.animX2],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            <motion.div
              className="intro-portal-container"
              initial="hidden"
              animate="visible"
            >
              <motion.button
                className="ocean-portal-btn"
                onClick={startExperience}
                variants={{
                  hidden: { scale: 0.5, opacity: 0, filter: "blur(20px)" },
                  visible: {
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="portal-content">
                  <motion.span
                    className="portal-action-v2"
                    variants={{
                      hidden: { scale: 0.8, opacity: 0 },
                      visible: {
                        scale: 1,
                        opacity: 1,
                        transition: {
                          delay: 1,
                          duration: 1.2,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    เริ่มการเดินทาง
                  </motion.span>
                </div>

                {/* Advanced Water Sphere Layers */}
                <div className="water-ripples" />
                <div className="water-caustics" />
                <div className="water-surface-shimmer" />
                <div className="water-inner-glow" />
                <div className="water-bubbles-portal">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="water-bubble-small" />
                  ))}
                </div>
              </motion.button>
            </motion.div>

            {/* Ambient Background Hint */}
            <div className="intro-bg-hint">
              <UnderwaterEnvironment />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="landing-bg">
        <UnderwaterEnvironment />
        <MarineSnow />
      </div>

      <SoundController bgSound={bgSound} />

      <div className="global-scene-layer-v2">
        {/* Place continuous background scene images here */}
      </div>

      <DepthIndicator />

      <section className="section-1-v2">
        <LightRays />
        <motion.div
          className="content-v2"
          style={{
            gridArea: "stack",
            y: headerY,
            opacity: headerOpacity,
          }}
        >
          <div className="header-text-v2">
            <motion.h1
              className="title-v2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Low-Poly Ocean
            </motion.h1>
            <motion.p
              className="subtitle-v2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              โลกในอีกมุมที่คุณไม่เคยเห็น
            </motion.p>
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
          yRange={["40%", "0%", "-10%"]}
          xRange={["30%", "0%", "10%"]} // Enter from Right and drift further Right away from left box
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["-10deg", "0deg", "5deg"]}
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
        <AnimalInfoBox
          animalId="irrawaddyDolphin"
          align="left"
          className="irrawaddy-info-v2"
        />
      </section>

      <section className="section-dolphin-standard-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide in & Drift
          xRange={["-30%", "0%", "5%"]} // From Left -> Center -> Drift Right
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["-10deg", "0deg", "5deg"]}
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
        <AnimalInfoBox
          animalId="dolphin"
          align="right"
          className="dolphin-info-v2"
        />
      </section>

      <section className="section-stingray-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["30%", "0%", "-5%"]} // Enter from Right
          scaleRange={[0.7, 1, 0.8]}
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
        <AnimalInfoBox
          animalId="stingray"
          align="left"
          className="stingray-info-v2"
        />
      </section>

      <section className="section-dugong-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "5%"]} // Enter from Left
          scaleRange={[0.8, 1, 0.9]}
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
        <AnimalInfoBox
          animalId="dugong"
          align="right"
          className="dugong-info-v2"
        />
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
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["10deg", "0deg", "-5deg"]}
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
        <AnimalInfoBox
          animalId="turtle"
          align="right"
          isOpaque={true}
          className="turtle-info-v2"
        />
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
          xRange={["30%", "0%", "10%"]} // Enter from Right and drift further Right away from box
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["10deg", "0deg", "-5deg"]}
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

        <AnimalInfoBox
          animalId="ronin"
          align="left"
          className="ronin-info-v2"
        />

        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "-10%"]} // Enter from Left and drift further Left away from box
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["-10deg", "0deg", "5deg"]}
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
        <AnimalInfoBox
          animalId="sawfishes"
          align="right"
          className="sawfishes-info-v2"
        />
      </section>

      <section className="section-orca-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["30%", "0%", "-5%"]} // Enter from Right
          scaleRange={[0.7, 1, 0.8]}
          rotateRange={["10deg", "0deg", "-5deg"]}
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
        <AnimalInfoBox animalId="orca" align="left" isOpaque={true} />
      </section>

      <section className="section-sperm-whale-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Slide & Drift
          xRange={["-30%", "0%", "5%"]} // Enter from Left
          scaleRange={[0.8, 1, 0.9]}
          rotateRange={["-10deg", "0deg", "5deg"]}
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
        <AnimalInfoBox animalId="spermWhale" align="right" />
      </section>

      <section className="section-blue-whale-v2">
        <ParallaxElement
          yRange={["40%", "0%", "-10%"]} // Vertical Slide & Drift
          xRange={["0%", "0%", "0%"]} // Center vertical
          scaleRange={[0.6, 1, 0.7]}
          rotateRange={["5deg", "0deg", "-5deg"]}
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
        <AnimalInfoBox animalId="blueWhale" align="left" isOpaque={true} />
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

      <BackToTop />
    </div>
  );
};

export default Landing;
