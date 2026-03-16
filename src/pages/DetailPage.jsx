import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMALS } from "../data/animalConfig";
import ANIMAL_DETAILS from "../data/animalDetails.json";
import Button from "../components/Button";
import UnderwaterEnvironment, {
  ShardExplosion,
  ModalDecorations,
} from "../components/UnderwaterEnvironment";
import SoundController from "../components/SoundController";
import "../components/SoundController.css";
import bgSound from "../assets/sound/bg-sound.MP3";
import "./DetailPage.css";

const MAX_SHARD_COUNT = Math.max(
  ...ANIMALS.map((animalConfig) => animalConfig.shards.length),
);
// [CONFIG] ความเร็วในการขยับของแต่ละชิ้นส่วน (หน่วย: วินาที)
const DURATION = 1.0;
// [CONFIG] เวลาที่ใช้ในการเรียงตัวทั้งหมดจนครบ (วินาที) - ไม่ว่าตัวสัตว์จะมีกี่ชิ้น ก็จะใช้เวลาเรียงตัวประมาณนี้
const TARGET_STAGGER_TIME = 1.25;

function DetailPage() {
  const levels = ANIMALS;
  const [searchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync index from URL parameter on mount
  useEffect(() => {
    const animalId = searchParams.get("id");
    if (animalId) {
      const index = levels.findIndex(
        (a) => a.id.toLowerCase() === animalId.toLowerCase(),
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [searchParams, levels]);

  const [direction, setDirection] = useState("left");
  const [mousePos, setMousePos] = useState(null);

  // State for active explosions
  const [explosions, setExplosions] = useState([]);

  const triggerExplosion = (x, y) => {
    const id = Date.now();
    setExplosions((prev) => [...prev, { id, x, y }]);
  };

  const removeExplosion = (id) => {
    setExplosions((prev) => prev.filter((exp) => exp.id !== id));
  };

  // Create an array of topic keys (e.g., ["intro", "threat", "solution"])
  const topicKeys = useMemo(() => Object.keys(ANIMAL_DETAILS.topics), []);

  const [activeTabKey, setActiveTabKey] = useState(topicKeys[0]);
  const [displayedKey, setDisplayedKey] = useState(topicKeys[0]); // New state for content
  const [showModal, setShowModal] = useState(false);
  const [isChangingTab, setIsChangingTab] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [shimmerReady, setShimmerReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Small delay to ensure browser has painted the initial scattered state
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (key, e) => {
    // Trigger explosion at click position
    if (e) {
      triggerExplosion(e.clientX, e.clientY);
    }

    // 0. Prevent action if modal is in the middle of closing
    if (isClosing) return;

    // 1. If modal is closed, ALWAYS open it and set the key
    if (!showModal) {
      setActiveTabKey(key);
      setDisplayedKey(key);
      setShowModal(true);
      return;
    }

    // 2. If modal is open, only switch if key is different
    if (key === activeTabKey) return;

    // 3. Switch logic with fade
    setActiveTabKey(key); // Update Button INSTANTLY
    setIsChangingTab(true);
    setTimeout(() => {
      setDisplayedKey(key); // Update Content AFTER delay
      setIsChangingTab(false);
    }, 300); // Wait for fade-out (300ms)
  };

  const closeModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setShowModal(false);
    // Lockout matches AnimatePresence duration (0.4s)
    setTimeout(() => {
      setIsClosing(false);
    }, 450);
  }, [isClosing]);
  // State stores the key string
  const stageRef = useRef(null);

  const animal = levels[currentIndex];

  // ... (existing code for finding details) ...

  const details =
    ANIMAL_DETAILS.animals.find(
      (animalDetail) =>
        animalDetail.id.toLowerCase() ===
        (animal.id || animal.name).toLowerCase(),
    ) || ANIMAL_DETAILS.animals[0]; // Fallback

  // ... (existing code) ...

  // ... (inside Return) ...

  const totalShards = animal?.shards?.length || 0;

  // Calculate dynamic stagger so total assembly time is consistent
  const staggerPerShard = TARGET_STAGGER_TIME / Math.max(1, totalShards);

  // Calculate the exact time the assembly animation finishes
  useEffect(() => {
    setShimmerReady(false);

    // Logic: The last shard to arrive has the max delay.
    // Total Time = (MaxDelay) + (Animation Duration)
    const maxDelay = (totalShards - 1) * staggerPerShard;
    const assemblyDuration = (maxDelay + DURATION) * 1000; // Convert to ms

    const timer = setTimeout(() => {
      setShimmerReady(true);
    }, assemblyDuration + 100); // Add small buffer (100ms) for smoothness

    return () => clearTimeout(timer);
  }, [currentIndex, totalShards, staggerPerShard]);

  const changeAnimal = (delta) => {
    setCurrentIndex((prev) => {
      const next = (prev + delta + levels.length) % levels.length;
      setDirection(next > prev ? "left" : "right");
      // Reset tab to first key
      setActiveTabKey(topicKeys[0]);
      return next;
    });
  };

  // ...

  const handleMouseMove = (e) => {
    // ... existing logic ...
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  const ratio = stageWidth / stageHeight;

  // Memoize the rank of each shard based on its order
  // This ensures animation starts at 0 and flows smoothly even if order values are sparse or high
  const shardRanks = useMemo(() => {
    if (!animal?.shards) return [];
    const withIndex = animal.shards.map((shard, index) => ({
      originalIndex: index,
      order: typeof shard.order === "number" ? shard.order : index,
    }));
    // Sort by order
    withIndex.sort((a, b) => a.order - b.order);

    // Map originalIndex -> Rank (0..N-1)
    const ranks = new Array(withIndex.length);
    withIndex.forEach((item, rank) => {
      ranks[item.originalIndex] = rank;
    });
    return ranks;
  }, [animal]);

  // ใช้ pool ใหญ่สุดเผื่อไว้ก่อน
  const pool = Array.from({ length: MAX_SHARD_COUNT }, (_, i) => i);
  // Calculate batch size: 2% of total shards (minimum 1)
  const batchSize = Math.max(1, Math.round(totalShards * 0.015));

  const shards = pool.map((index) => {
    // ต้องระวัง Index เกิน range ของสัตว์ปัจจุบัน
    const shardData = animal.shards[index];

    // ถ้าเกิน range ก็แสดงเป็นตัว invisible เพื่อให้ transition สวย
    // If not ready, keep shards scattered (isVisible = false) to trigger entry animation
    const isVisible = !!shardData && isReady;

    // Use normalized rank for animation to prevent large delays if orders are high numbers
    const rank = shardRanks[index] ?? index;

    const orderIndex = direction === "left" ? rank : totalShards - 1 - rank;

    const delay = orderIndex * staggerPerShard;

    const currentClipPath = isVisible
      ? shardData.clipPath
      : "polygon(50% 50%, 50% 50%, 50% 50%)";

    // Simplified color logic: No hover, no mark
    const currentColor = isVisible ? shardData.color : "transparent";
    const currentOpacity = isVisible ? 1 : 0;
    const pointerEvents = isVisible ? "auto" : "none";

    // Random scatter position for invisible shards based on index
    // Using Math.sin/cos with index ensures consistent 'random' positions
    const angle = index * 137.5 * (Math.PI / 180); // Golden angle for distribution
    const radius = 600 + (index % 10) * 100; // Varying distance (increased range)
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;
    const rot = (index * 45) % 360;

    const currentTransform = isVisible
      ? "translate(0px, 0px) rotate(0deg)"
      : `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

    return (
      <div
        key={index}
        className={`shard ${shimmerReady ? "shimmer-ready" : ""}`}
        style={{
          clipPath: currentClipPath,
          WebkitClipPath: currentClipPath,
          backgroundColor: currentColor,
          opacity: currentOpacity,
          pointerEvents: pointerEvents,
          zIndex: 1,
          transform: currentTransform,

          transition: `
            clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            opacity 0.4s ${delay}s ease-out,
            background-color 0s 0s linear,
            transform ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1)
          `,
          "--shimmer-delay": `${Math.floor(rank / batchSize) * 0.1}s`,
        }}
      />
    );
  });

  return (
    <div className="explore-page">
      {/* Background (Dark Gradient) */}
      <div className="explore-bg">
        <UnderwaterEnvironment />
      </div>

      {!showModal && <SoundController bgSound={bgSound} />}

      {/* Main Content Container */}
      <div className="explore-container">
        {/* Upper Section: Arrows + Stage */}
        <div className="stage-section">
          {/* Left Arrow */}
          <button
            className="nav-arrow prev"
            onClick={() => changeAnimal(-1)}
            aria-label="Previous animal"
          >
            <span className="nav-label">ก่อนหน้า</span>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Stage Area */}
          <div
            className="stage-wrapper"
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos(null)}
            style={{ "--ratio": ratio }}
          >
            <div
              className="stage-inner"
              style={{
                transform: "scale(1.2)",
                transformOrigin: "center center",
                cursor: "default",
              }}
            >
              {shards}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className="nav-arrow next"
            onClick={() => changeAnimal(1)}
            aria-label="Next animal"
          >
            <span className="nav-label">ถัดไป</span>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Lower Section: Info */}
        {/* NEW LAYOUT: Split Title and Menu */}

        {/* NEW LAYOUT: Title Block (Species in Pieces Style) */}
        <div className="title-block" key={currentIndex}>
          <div className="title-left">
            <span className="animal-label">Animal</span>
            <span className="piece-number">{currentIndex + 1}</span>
          </div>
          <div className="title-divider"></div>
          <h1 className="title-name">{details.nameEN}</h1>
        </div>

        {/* 2. Ghost Menu (Bottom) */}
        <div className="ghost-menu-container">
          {topicKeys.map((key) => (
            <button
              key={key}
              className={`ghost-btn`}
              onClick={(e) => handleTabChange(key, e)}
            >
              {ANIMAL_DETAILS.topics[key]}
            </button>
          ))}
        </div>

        {/* 3. Detail Modal (Full Screen) with Framer Motion */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              key="modal-overlay"
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={closeModal}
            >
              <motion.div
                key="modal-card"
                className="modal-glass-card"
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100vh", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalDecorations />
                {!isClosing && (
                  <button
                    className="modal-close-btn"
                    onClick={closeModal}
                    aria-label="Close modal"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      style={{ display: "block", flexShrink: 0 }}
                    >
                      <line
                        x1="1"
                        y1="1"
                        x2="13"
                        y2="13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="13"
                        y1="1"
                        x2="1"
                        y2="13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}

                <h2 className="modal-title">{details.nameEN}</h2>

                {/* Internal Navigation Tabs */}
                <div className="modal-nav">
                  {topicKeys.map((key) => {
                    // Icon mapping for each topic
                    const getIcon = (topicKey) => {
                      switch (topicKey) {
                        case "intro":
                          return (
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
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                          );
                        case "threat":
                          return (
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
                              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                              <line x1="12" y1="8" x2="12" y2="12" />
                              <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                          );
                        case "solution":
                          return (
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
                              <circle cx="12" cy="12" r="10" />
                              <circle cx="12" cy="12" r="4" />
                              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                              <line
                                x1="14.83"
                                y1="14.83"
                                x2="19.07"
                                y2="19.07"
                              />
                              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
                            </svg>
                          );
                        default:
                          return null;
                      }
                    };

                    return (
                      <button
                        key={key}
                        className={`modal-tab-btn ${activeTabKey === key ? "active" : ""}`}
                        onClick={(e) => handleTabChange(key, e)}
                      >
                        <span className="tab-icon">{getIcon(key)}</span>
                        <span className="tab-label">
                          {ANIMAL_DETAILS.topics[key]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div
                  className={`modal-content-scroll ${isChangingTab ? "fading-out" : ""}`}
                >
                  <h3 className="modal-subtitle">
                    {ANIMAL_DETAILS.topics[displayedKey]}
                  </h3>
                  <p className="modal-text">
                    {details.content[displayedKey] ||
                      "No description available."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render Active Explosions */}
      {explosions.map((exp) => (
        <ShardExplosion
          key={exp.id}
          x={exp.x}
          y={exp.y}
          onComplete={() => removeExplosion(exp.id)}
        />
      ))}

      {/* Helper Controls (Hidden or Minimized?) */}

      {/* Back Button - Stable DOM reference (toggled via CSS) */}
      {!showModal && (
        <Link to="/stages" className="back-link" state={{ fromExplore: true }}>
          ← ย้อนกลับ
        </Link>
      )}
    </div>
  );
}

export default DetailPage;
