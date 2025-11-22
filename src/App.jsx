// src/App.jsx
import { useState, useMemo } from "react";
import { ANIMALS } from "./animalConfig";

const SHARD_COUNT = ANIMALS[0].shards.length;

// ปรับให้เห็นลำดับชัด ๆ ก่อน ถ้าโอเคค่อยลดลง
const DURATION = 1.04;
const STAGGER = 0.03; // 0, 0.05, 0.10 ... ชิ้นท้าย ๆ จะช้าชัด ๆ

// เอาไว้คำนวณตำแหน่ง label เฉย ๆ
function getPolygonCentroid(clipPath) {
  const regex = /([\d.]+)%\s+([\d.]+)%/g;
  const xs = [];
  const ys = [];
  let match;

  while ((match = regex.exec(clipPath)) !== null) {
    xs.push(parseFloat(match[1]));
    ys.push(parseFloat(match[2]));
  }

  if (!xs.length) return { cx: 50, cy: 50 };

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);

  return {
    cx: sumX / xs.length,
    cy: sumY / ys.length,
  };
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [showLabels, setShowLabels] = useState(false);

  const changeAnimal = (delta) => {
    setCurrentIndex((prev) => {
      const next = (prev + delta + ANIMALS.length) % ANIMALS.length;
      if (next > prev) setDirection("left");
      else if (next < prev) setDirection("right");
      return next;
    });
  };

  const animal = ANIMALS[currentIndex];

  // centroid ไว้ใช้วางตัวเลข
  const centroids = useMemo(
    () => animal.shards.map((shard) => getPolygonCentroid(shard.clipPath)),
    [animal]
  );

  const shards = animal.shards.map((shard, i) => {
    // 1) ใช้ order จาก config ถ้ามี, ไม่งั้นใช้ i
    let baseOrder = typeof shard.order === "number" ? shard.order : i;

    // normalize ให้แน่ใจว่าอยู่ในช่วง 0..N-1
    baseOrder = ((baseOrder % SHARD_COUNT) + SHARD_COUNT) % SHARD_COUNT;

    // 2) ถ้าไปข้างหน้า = ตาม order, ถ้าย้อนกลับ = กลับด้าน
    const orderIndex =
      direction === "left" ? baseOrder : SHARD_COUNT - 1 - baseOrder;

    const delay = orderIndex * STAGGER;

    const clip = shard.clipPath;
    const color = shard.color;

    return (
      <div
        key={i}
        className="shard"
        style={{
          clipPath: clip,
          WebkitClipPath: clip,
          backgroundColor: color,
          transition: `
  clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
  -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
  background-color ${DURATION}s ${delay}s ease-out
`,
        }}
      />
    );
  });

  const labels =
    showLabels &&
    centroids.map((c, i) => (
      <div
        key={`label-${i}`}
        className="shard-label"
        style={{ left: `${c.cx}%`, top: `${c.cy}%` }}
      >
        {i + 1}
      </div>
    ));

  return (
    <div className="page">
      <div className="wrap">
        <div id="animalchanger">
          {shards}
          {labels}
        </div>
      </div>

      <div className="info">
        <h2>{animal.name}</h2>
        <p>{animal.id}</p>
      </div>

      <div className="controls">
        <button onClick={() => changeAnimal(-1)}>Prev</button>
        <button onClick={() => changeAnimal(1)}>Next</button>
        <button onClick={() => setShowLabels((v) => !v)}>
          {showLabels ? "Hide shard numbers" : "Show shard numbers"}
        </button>
      </div>
    </div>
  );
}

export default App;
