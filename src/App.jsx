import { useState } from "react";
import { ANIMALS } from "./animalConfig";

const SHARD_COUNT = ANIMALS[0].shards.length;
const DURATION = 5.0;
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

  // เอาขนาด SVG มาสร้างอัตราส่วน
  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  const ratio = stageWidth / stageHeight;

  const shards = animal.shards.map((shard, i) => {
    let baseOrder = typeof shard.order === "number" ? shard.order : i;
    baseOrder = ((baseOrder % SHARD_COUNT) + SHARD_COUNT) % SHARD_COUNT;

    const orderIndex =
      direction === "left" ? baseOrder : SHARD_COUNT - 1 - baseOrder;

    const delay = orderIndex * STAGGER;

    return (
      <div
        key={i}
        className="shard"
        onMouseEnter={() => setHoverIndex(i)}
        onMouseLeave={() => setHoverIndex(null)}
        style={{
          clipPath: shard.clipPath,
          WebkitClipPath: shard.clipPath,
          backgroundColor: shard.color,
          transition: `
            clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            background-color ${DURATION}s ${delay}s ease-out
          `,
        }}
      />
    );
  });

  // ข้อความเลข shard แถวปุ่ม
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
