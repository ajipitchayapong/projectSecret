import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { Link } from "react-router-dom";
import bottomLayer from "../images/bottom_layer.webp";
import middleLayer from "../images/middle_layer.webp";
import topLayer from "../images/top_layer.webp";
import paperShip from "../images/paperShip.webp";
import orcaImg from "../images/orca.webp";
import bearImg from "../images/bear.webp";
import "./PolygonPage.css";

const PolygonPage = () => {
  const containerRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const audioRef = useRef(null);
  const audioTimeoutRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio(
      "https://www.orangefreesounds.com/wp-content/uploads/2015/06/Rowing.mp3",
    );
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    };
  }, []);

  // Sync audio play/pause with toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (isAudioEnabled) {
      audioRef.current.play().catch(() => {
        console.warn("Autoplay blocked. Will attempt play on first scroll.");
        // Don't turn it off, just wait for user interaction (scroll)
      });
    } else {
      audioRef.current.pause();
      audioRef.current.volume = 0;
    }
  }, [isAudioEnabled]);

  // Measure widest layer to set scroll distance
  const handleLayerLoad = (e) => {
    setMaxWidth((prev) => Math.max(prev, e.target.offsetWidth));
  };

  // Use scrollYProgress to drive horizontal movement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll detection for audio volume
  useMotionValueEvent(scrollYProgress, "change", () => {
    if (!isAudioEnabled || !audioRef.current) return;

    // Browser policy: retry playing on scroll if it was blocked initially
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        /* Still blocked, wait for next interaction */
      });
    }

    // Reset volume to an extremely soft and light level for the paper ship
    audioRef.current.volume = 0.08; // Very subtle

    // Clear timeout and set a new one to fade out volume when scrolling stops
    if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
    audioTimeoutRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }, 400); // Decelerate to silence even more gradually
  });

  // Create a smooth spring version of scroll progress - Slowed down
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60, // Reduced from 100 for more weight
    damping: 35, // Increased for smoothness
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

  // Orca Jump Animation Logic: Widened ranges to slow down the movement
  const orcaJumpY = useTransform(
    smoothProgress,
    [0.3, 0.45, 0.6, 0.75, 0.85], // Widened from [0.4, 0.5, 0.6, 0.7, 0.75]
    [650, 100, -30, 100, 650],
  );
  const orcaRotate = useTransform(
    smoothProgress,
    [0.3, 0.45, 0.6, 0.75, 0.85],
    [50, 60, 0, -60, -85],
  );
  const orcaMessageScale = useTransform(
    smoothProgress,
    [0.4, 0.6, 0.82],
    [0.8, 1, 1],
  );
  const orcaMessageOpacity = useTransform(
    smoothProgress,
    [0.4, 0.6, 0.72, 0.82],
    [0, 1, 1, 0],
  );

  // Orca Horizontal Surge: Widened range to match
  const baseOrcaXStart = maxWidth * 0.6;
  const baseOrcaXEnd = -travelDistance * 0.85 + baseOrcaXStart;
  const orcaX = useTransform(
    smoothProgress,
    [0, 0.3, 0.6, 0.85, 1], // Widened
    [
      baseOrcaXStart,
      baseOrcaXStart - travelDistance * 0.15,
      baseOrcaXStart - travelDistance * 0.8,
      baseOrcaXStart - travelDistance * 1.5,
      baseOrcaXEnd,
    ],
  );

  // Create a dedicated spring for the bear - Slightly faster for responsive feel
  const bearSpring = useSpring(smoothProgress, {
    stiffness: 45, // Increased from 30
    damping: 30, // Slightly reduced from 35
    restDelta: 0.001,
  });

  // Bear Appearance Animation: Narrowed range to speed up the slide-in [0.75, 0.92]
  const bearX = useTransform(bearSpring, [0.75, 0.92], [450, 0]);
  const bearOpacity = useTransform(bearSpring, [0.75, 0.85, 0.92], [0, 1, 1]);

  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const [showHint, setShowHint] = useState(true);

  // เพิ่มหลัง showHint state
  const [sliderValue, setSliderValue] = useState(0);

  // sync scroll → slider
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setSliderValue(v * 100);
    if (v > 0.02) setShowHint(false);
  });

  // slider → scroll
  const handleSliderChange = (e) => {
    const val = Number(e.target.value) / 100;
    const container = containerRef.current;
    if (!container) return;
    const maxScroll = container.scrollHeight - window.innerHeight;
    window.scrollTo({ top: val * maxScroll });
  };

  return (
    <div className="polygon-page-container" ref={containerRef}>
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

        {/* Polar Bear */}
        <motion.div
          className="bear-wrapper"
          style={{
            x: bearX,
            opacity: bearOpacity,
          }}
        >
          {/* Information box near the bear */}
          <motion.div
            className="bear-message-box"
            style={{
              opacity: useTransform(bearSpring, [0.75, 0.85], [0, 1]),
              scale: useTransform(bearSpring, [0.75, 0.85], [0.8, 1]),
            }}
          >
            <p>
              "Polygon art หรือ Low poly
              คือสไตล์ศิลปะดิจิทัลที่ใช้รูปหลายเหลี่ยมจำนวนน้อย ๆ
              สร้างภาพหรือโมเดล
              โดยเน้นความเรียบง่ายและมุมมองแบบเรขาคณิตแทนรายละเอียดสมจริง
              มันเกิดจากกราฟิกคอมพิวเตอร์ยุคแรกๆ
              ที่เครื่องมือจำกัดจำนวนโพลีกอนต่ำเพื่อประสิทธิภาพ
              แต่ปัจจุบันกลายเป็นสไตล์ศิลปะยอดนิยมในเกม วิดีโอ และภาพประกอบ"
            </p>
          </motion.div>

          {/* Static flip applied to img wrapper to avoid transform conflicts */}
          <div className="bear-flip-container">
            <img src={bearImg} alt="Polar Bear" className="bear-img" />
          </div>
        </motion.div>

        {/* Persistent Conservation Message: Now flows with the scene */}
        <motion.div
          className="orca-message-box"
          style={{
            opacity: orcaMessageOpacity,
            scale: orcaMessageScale,
            x: bgXMiddle, // Sync with middle layer for horizontal flow
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

      {/* Scrubber Tube — mobile/tablet only */}
      <div className="scrubber-track-container">
        <div className="scrubber-label-left">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </div>

        <div
          className="scrubber-tube"
          style={{ "--thumb-pos": `${sliderValue}%` }}
        >
          <div className="scrubber-fill" style={{ width: `${sliderValue}%` }} />
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={sliderValue}
            onChange={handleSliderChange}
            className="scrubber-input"
            aria-label="เลื่อนดูเนื้อหา"
          />
        </div>

        <div className="scrubber-label-right">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      {createPortal(
        <div className="hud-overlay">
          <Link to="/stages" className="back-link" state={{ skipIntro: true }}>
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
            ย้อนกลับ
          </Link>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default PolygonPage;
