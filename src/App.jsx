import { useState, useRef } from "react";
import { ANIMALS } from "./animalConfig";
import "./App.css";

const MAX_SHARD_COUNT = Math.max(...ANIMALS.map((a) => a.shards.length));
const DURATION = 1.0;
const STAGGER = 0.015;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [showLabels, setShowLabels] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  // 1. เพิ่ม State เก็บรายการ Shard ที่ถูกคลิก (ใช้ Set เพื่อกันเลขซ้ำ)
  const [markedShards, setMarkedShards] = useState(new Set());

  const [mousePos, setMousePos] = useState(null);
  const stageRef = useRef(null);

  const changeAnimal = (delta) => {
    // 2. เมื่อเปลี่ยนสัตว์ ให้เคลียร์ค่าที่มาร์คไว้ (หรือถ้าไม่อยากเคลียร์ก็ลบบรรทัดนี้ทิ้ง)
    setMarkedShards(new Set());

    setCurrentIndex((prev) => {
      const next = (prev + delta + ANIMALS.length) % ANIMALS.length;
      setDirection(next > prev ? "left" : "right");
      return next;
    });
  };

  // 3. ฟังก์ชันสำหรับคลิกเลือก/ยกเลิกเลือก
  const toggleShard = (index) => {
    const newSet = new Set(markedShards);
    if (newSet.has(index)) {
      newSet.delete(index); // ถ้ามีแล้วให้ลบออก (Unmark)
    } else {
      newSet.add(index); // ถ้ายังไม่มีให้เพิ่ม (Mark)
    }
    setMarkedShards(newSet);

    // log ออกมาดูใน Console เผื่อก๊อปไปใช้ต่อ
    console.log(
      "Marked Indices:",
      [...newSet].sort((a, b) => a - b)
    );
  };

  const handleMouseMove = (e) => {
    if (!showLabels || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const animal = ANIMALS[currentIndex];
  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  const ratio = stageWidth / stageHeight;

  const pool = Array.from({ length: MAX_SHARD_COUNT }, (_, i) => i);

  const shards = pool.map((i) => {
    const shardData = animal.shards[i];
    const isVisible = !!shardData;
    const isHovered = i === hoverIndex;

    // 4. เช็คว่า Index นี้ถูกมาร์คไว้ไหม
    const isMarked = markedShards.has(i);

    let baseOrder =
      isVisible && typeof shardData.order === "number" ? shardData.order : i;
    baseOrder =
      ((baseOrder % MAX_SHARD_COUNT) + MAX_SHARD_COUNT) % MAX_SHARD_COUNT;

    const orderIndex =
      direction === "left" ? baseOrder : MAX_SHARD_COUNT - 1 - baseOrder;

    const delay = orderIndex * STAGGER;

    const currentClipPath = isVisible
      ? shardData.clipPath
      : "polygon(50% 50%, 50% 50%, 50% 50%)";

    // 5. Logic ลำดับสี (Priority):
    // - ถ้า Hover -> สีฟ้า (#00FFFF)
    // - ถ้าไม่ได้ Hover แต่ถูก Mark -> สีแดงอมชมพู (#FF0055)
    // - ถ้าปกติ -> สีเดิม
    const currentColor = isVisible
      ? isHovered
        ? "#00FFFF"
        : isMarked
        ? "#FF0055"
        : shardData.color
      : "transparent";

    const currentOpacity = isVisible ? 1 : 0;
    const pointerEvents = isVisible ? "auto" : "none";

    return (
      <div
        key={i}
        className="shard"
        onMouseEnter={() => isVisible && setHoverIndex(i)}
        onMouseLeave={() => setHoverIndex(null)}
        // 6. ใส่ Event Click
        onClick={() => isVisible && toggleShard(i)}
        style={{
          clipPath: currentClipPath,
          WebkitClipPath: currentClipPath,
          backgroundColor: currentColor,
          opacity: currentOpacity,
          pointerEvents: pointerEvents,
          zIndex: isHovered ? 100 : 1,

          transition: `
            clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            opacity ${DURATION}s ${delay}s ease-out,
            background-color 0s 0s linear 
          `,
        }}
      />
    );
  });

  // ... (ส่วน return ด้านล่างเหมือนเดิม)
  let hoverLabelText = "";
  if (showLabels) {
    if (hoverIndex !== null) {
      hoverLabelText = `Shard #${hoverIndex + 1}`;
    } else {
      hoverLabelText = "Hover บนชิ้น polygon เพื่อดูเลข";
    }
  }

  return (
    <div className="page">
      {/* ... (เหมือนเดิม) ... */}
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
            transform: showLabels ? "scale(2.5)" : "scale(1)",
            transformOrigin:
              showLabels && mousePos
                ? `${mousePos.x}px ${mousePos.y}px`
                : "center center",
            cursor: showLabels ? "crosshair" : "default",
          }}
        >
          {shards}
        </div>
      </div>

      <div className="controls">
        {/* ... (เหมือนเดิม) ... */}
        <button onClick={() => changeAnimal(-1)}>Prev</button>
        <button onClick={() => changeAnimal(1)}>Next</button>
        <button onClick={() => setShowLabels((v) => !v)}>
          {showLabels ? "Hide shard numbers" : "Show shard numbers"}
        </button>
        {showLabels && <div className="hover-label">{hoverLabelText}</div>}
      </div>
    </div>
  );
}

export default App;
