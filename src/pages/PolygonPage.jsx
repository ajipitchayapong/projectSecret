import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import bottomLayer from "../images/bottom_layer.webp";
import middleLayer from "../images/middle_layer.webp";
import topLayer from "../images/top_layer.webp";
import paperShip from "../images/paperShip.webp";
import orcaImg from "../images/orca.webp";
import "./PolygonPage.css";

const PolygonPage = () => {
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);

  // Measure widest layer to set scroll distance
  const handleLayerLoad = (e) => {
    setMaxWidth((prev) => Math.max(prev, e.target.offsetWidth));
  };

  // Use scrollYProgress to drive horizontal movement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Create a smooth spring version of scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
    restDelta: 0.001,
  });

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const travelDistance = Math.max(0, maxWidth - viewportWidth);

  // Parallax multipliers for depth effect
  // Bottom (Far): moves slowest
  const bgXBottom = useTransform(
    smoothProgress,
    [0, 1],
    [0, -travelDistance * 0.7],
  );
  // Middle: moves slightly faster
  const bgXMiddle = useTransform(
    smoothProgress,
    [0, 1],
    [0, -travelDistance * 0.85],
  );
  // Top (Near): moves at full speed (max travel)
  const bgXTop = useTransform(smoothProgress, [0, 1], [0, -travelDistance]);

  // Orca Jump Animation Logic with Perfect High Arc & Wide Distance (CONDENSED)
  const orcaJumpY = useTransform(
    smoothProgress,
    [0.4, 0.5, 0.6, 0.7, 0.75], // Compressed range
    [650, 100, -30, 100, 650],
  );
  const orcaRotate = useTransform(
    smoothProgress,
    [0.4, 0.5, 0.6, 0.7, 0.75],
    [50, 60, 0, -60, -85],
  );
  const orcaMessageScale = useTransform(
    smoothProgress,
    [0.5, 0.6, 0.72],
    [0.8, 1, 1],
  );
  const orcaMessageOpacity = useTransform(
    smoothProgress,
    [0.5, 0.6, 0.72],
    [0, 1, 1],
  );

  // Orca Horizontal Surge: Aggressive wide distance between launch and splash
  const baseOrcaXStart = maxWidth * 0.6; // Shifted left to condense the scene
  const baseOrcaXEnd = -travelDistance * 0.85 + baseOrcaXStart;
  const orcaX = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 0.75, 1],
    [
      baseOrcaXStart,
      baseOrcaXStart - travelDistance * 0.15, // Takeoff point
      baseOrcaXStart - travelDistance * 0.8, // Mid-leap surge
      baseOrcaXStart - travelDistance * 1.5, // Distant splash-down point
      baseOrcaXEnd,
    ],
  );

  return (
    <div className="polygon-page-container" ref={containerRef}>
      <Link to="/stages" className="back-link">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        กลับหน้าหลัก
      </Link>

      <div className="parallax-wrapper">
        {/* Layer 1: Bottom (Farthest) */}
        <motion.img
          src={bottomLayer}
          onLoad={handleLayerLoad}
          className="bg-layer-img bottom"
          style={{ x: bgXBottom }}
          alt=""
        />

        {/* Layer 2: Middle */}
        <motion.img
          src={middleLayer}
          onLoad={handleLayerLoad}
          className="bg-layer-img middle"
          style={{ x: bgXMiddle }}
          alt=""
        />

        {/* Layer 3: Top (Closest) */}
        <motion.img
          src={topLayer}
          onLoad={handleLayerLoad}
          className="bg-layer-img top"
          style={{ x: bgXTop }}
          alt=""
        />

        {/* Paper Ship: Positioned at center-left, following the scroll journey */}
        <motion.div
          className="paper-ship-wrapper"
          style={{
            x: useTransform(smoothProgress, [0, 1], [0, viewportWidth * 0.1]), // Move slightly forward
            y: useTransform(smoothProgress, (v) => Math.sin(v * 20) * 10), // Gentle bobbing
          }}
        >
          <img src={paperShip} alt="Paper Ship" className="paper-ship" />
        </motion.div>

        {/* Jumping Orca */}
        <motion.div
          className="orca-wrapper"
          style={{
            x: orcaX,
            y: orcaJumpY,
            rotate: orcaRotate,
          }}
        >
          <img src={orcaImg} alt="Orca" className="orca-img" />
        </motion.div>
      </div>

      {/* Persistent Conservation Message: Moved OUTSIDE parallax-wrapper to be completely static */}
      <motion.div
        className="orca-message-box"
        style={{
          opacity: orcaMessageOpacity,
          scale: orcaMessageScale,
        }}
      >
        <p>
          หัวใจหลักของงานนี้คือการแสดงให้เห็นว่าสัตว์เหล่านี้กำลังจะหายไป
          การใช้รูปทรงเรขาคณิตที่นำมาต่อกันจนเป็นรูปเป็นร่าง
          สื่อถึงความเปราะบางว่า "หากชิ้นส่วนใดชิ้นส่วนหนึ่งหายไป
          ภาพรวมทั้งหมดก็จะพังทลายลง"
          เหมือนกับระบบนิเวศที่ถ้าสายพันธุ์หนึ่งสูญพันธุ์ไป
          ก็จะกระทบต่อสมดุลทั้งหมด
        </p>
      </motion.div>
    </div>
  );
};

export default PolygonPage;
