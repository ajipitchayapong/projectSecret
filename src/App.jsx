import { useState } from "react";
import { ANIMALS } from "./animalConfig";

// 1. หาค่า Shard ที่มากที่สุดในบรรดาสัตว์ทุกตัว เพื่อสร้าง Pool รอไว้
const MAX_SHARD_COUNT = Math.max(...ANIMALS.map((a) => a.shards.length));
const DURATION = 1.0;
const STAGGER = 0.015;

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [showLabels, setShowLabels] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const changeAnimal = (delta) => {
    setCurrentIndex((prev) => {
      const next = (prev + delta + ANIMALS.length) % ANIMALS.length;
      setDirection(next > prev ? "left" : "right");
      return next;
    });
  };

  const animal = ANIMALS[currentIndex];

  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  const ratio = stageWidth / stageHeight;

  // 2. สร้าง Array เปล่าตามจำนวน MAX เพื่อ Loop
  // (ไม่ใช่ loop ตาม animal.shards แล้ว)
  const pool = Array.from({ length: MAX_SHARD_COUNT }, (_, i) => i);

  const shards = pool.map((i) => {
    // 3. เช็คว่าสัตว์ตัวนี้ มีข้อมูลที่ index นี้หรือไม่
    const shardData = animal.shards[i];
    const isVisible = !!shardData; // ถ้ามีข้อมูล = true, ไม่มี = false

    // 4. คำนวณ Order: ถ้าไม่มีข้อมูล ให้ใช้ index ตัวมันเองแทน
    let baseOrder =
      isVisible && typeof shardData.order === "number" ? shardData.order : i;

    // ใช้ MAX_SHARD_COUNT ในการคำนวณ modulo แทน
    baseOrder =
      ((baseOrder % MAX_SHARD_COUNT) + MAX_SHARD_COUNT) % MAX_SHARD_COUNT;

    const orderIndex =
      direction === "left" ? baseOrder : MAX_SHARD_COUNT - 1 - baseOrder;

    const delay = orderIndex * STAGGER;

    // 5. กำหนดค่า Style ตามสถานะ (มีของ vs ไม่มีของ)
    // ถ้าไม่มีของ: ให้ยุบ clipPath เป็นจุดตรงกลาง (50% 50%) และสีใส
    const currentClipPath = isVisible
      ? shardData.clipPath
      : "polygon(50% 50%, 50% 50%, 50% 50%)"; // ยุบรวมตรงกลาง

    const currentColor = isVisible ? shardData.color : "transparent";
    const currentOpacity = isVisible ? 1 : 0;
    const pointerEvents = isVisible ? "auto" : "none"; // ป้องกันเมาส์ไปโดนตัวที่ซ่อน

    return (
      <div
        key={i} // ใช้ index คงที่ เพื่อให้ React รู้ว่าเป็น div เดิมเสมอ
        className="shard"
        onMouseEnter={() => isVisible && setHoverIndex(i)} // เช็ค isVisible ก่อน
        onMouseLeave={() => setHoverIndex(null)}
        style={{
          // ใส่ค่าที่คำนวณไว้ด้านบน
          clipPath: currentClipPath,
          WebkitClipPath: currentClipPath,
          backgroundColor: currentColor,
          opacity: currentOpacity,
          pointerEvents: pointerEvents,

          // Transition เหมือนเดิม
          transition: `
            clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            background-color ${DURATION}s ${delay}s ease-out,
            opacity ${DURATION}s ${delay}s ease-out
          `,
        }}
      />
    );
  });

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
      <div className="animal-stage" style={{ "--ratio": ratio }}>
        {shards}
      </div>

      <div className="controls">
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
