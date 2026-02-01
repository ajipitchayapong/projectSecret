import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ANIMALS } from "../data/animalConfig";
import ANIMAL_DETAILS from "../data/animalDetails.json";
import Button from "../components/Button";
import "./ExploreMore.css";

const MAX_SHARD_COUNT = Math.max(
  ...ANIMALS.map((animalConfig) => animalConfig.shards.length),
);
// [CONFIG] ความเร็วในการขยับของแต่ละชิ้นส่วน (หน่วย: วินาที)
const DURATION = 1.0;
// [CONFIG] เวลาที่ใช้ในการเรียงตัวทั้งหมดจนครบ (วินาที) - ไม่ว่าตัวสัตว์จะมีกี่ชิ้น ก็จะใช้เวลาเรียงตัวประมาณนี้
const TARGET_STAGGER_TIME = 1.25;

function ExploreMore() {
  const levels = ANIMALS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [mousePos, setMousePos] = useState(null);
  // Create an array of topic keys (e.g., ["intro", "threat", "solution"])
  const topicKeys = useMemo(() => Object.keys(ANIMAL_DETAILS.topics), []);

  const [activeTabKey, setActiveTabKey] = useState(topicKeys[0]);
  const [isChangingTab, setIsChangingTab] = useState(false);
  const [shimmerReady, setShimmerReady] = useState(false);

  // Calculate the exact time the assembly animation finishes


  const handleTabChange = (key) => {
    if (key === activeTabKey) return;
    setActiveTabKey(key);
    setIsChangingTab(true);
    setTimeout(() => setIsChangingTab(false), 600); // Match CSS animation duration
  };
  // State stores the key string
  const stageRef = useRef(null);

  const animal = levels[currentIndex];

  // Lookup details from JSON using ID (lowercase matching for safety)
  const details =
    ANIMAL_DETAILS.animals.find(
      (animalDetail) =>
        animalDetail.id.toLowerCase() ===
        (animal.id || animal.name).toLowerCase(),
    ) || ANIMAL_DETAILS.animals[0]; // Fallback

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
    const isVisible = !!shardData;

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
        <div className="wave-layer" />
        <div className="caustics-layer" />
        <div className="light-sweep-layer" />
      </div>

      {/* Main Content Container */}
      <div className="explore-container">
        {/* Step Indicator (Progress Dots) */}
        <div className="progress-container">
          <div className="progress-indicator">
            {/* Background Track */}
            <div className="progress-track-bg" />

            {/* Traveling Fill - Width based on current index */}
            <div
              className="progress-track-fill"
              style={{
                width: `${(currentIndex / (levels.length - 1)) * 100}%`,
              }}
            />

            {levels.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentIndex ? "active" : ""
                  } ${index < currentIndex ? "passed" : ""}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setActiveTabKey(topicKeys[0]); // Reset tab when jumping
                  setDirection(index > currentIndex ? "left" : "right");
                }}
              />
            ))}
          </div>
        </div>

        {/* Upper Section: Arrows + Stage */}
        <div className="stage-section">
          {/* Left Arrow */}
          <button className="nav-arrow prev" onClick={() => changeAnimal(-1)}>
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
                transform: "scale(1)",
                transformOrigin: "center center",
                cursor: "default",
              }}
            >
              {shards}
            </div>
          </div>

          {/* Right Arrow */}
          <button className="nav-arrow next" onClick={() => changeAnimal(1)}>
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
        <div className={`info-section ${isChangingTab ? "tab-changing" : ""}`}>
          {/* Use English Name from JSON - Keyed to currentIndex to re-animate on animal change */}
          <h1 className="animal-title" key={currentIndex}>
            {details.nameEN}
          </h1>

          {/* Dynamic Menu from JSON (Key-Based) */}
          <div className="info-menu">
            {topicKeys.map((key) => (
              <span
                key={key}
                className={`menu-item ${activeTabKey === key ? "active" : ""}`}
                onClick={() => handleTabChange(key)}
                style={{ cursor: "pointer" }}
              >
                {ANIMAL_DETAILS.topics[key]}
              </span>
            ))}
          </div>

          {/* Description from JSON - Keyed to both animal and tab for smooth transitions */}
          <p
            className="animal-description"
            key={`${currentIndex}-${activeTabKey}`}
          >
            {details.content[activeTabKey] || "No description available."}
          </p>
        </div>
      </div>

      {/* Helper Controls (Hidden or Minimized?) */}

      {/* Back Button */}
      <Link to="/" className="back-link">
        ← Back
      </Link>
    </div>
  );
}

export default ExploreMore;
