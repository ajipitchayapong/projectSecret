import { useState, useRef, useEffect } from "react";
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

  // 1. เปลี่ยนจาก Set เป็น Array เพื่อเก็บลำดับการคลิก (Order)
  const [markedOrder, setMarkedOrder] = useState([]);

  const [mousePos, setMousePos] = useState(null);
  const stageRef = useRef(null);

  const animal = ANIMALS[currentIndex];
  // หาจำนวน Shard จริงๆ ของสัตว์ตัวปัจจุบัน (ไม่นับ Shard ที่อาจจะเป็น null/disabled ถ้ามี)
  // แต่จาก config ดูเหมือนจะเต็ม array แต่เราสามารถใช้ length ของ animal.shards ได้เลย
  const totalShards = animal.shards.length;

  // Effect สำหรับเช็คว่าครบหรือยัง แล้ว Auto Export
  useEffect(() => {
    if (markedOrder.length > 0 && markedOrder.length === totalShards) {
        // ให้เวลา State Update และ Render แป๊บนึงก่อน Export
        const timeout = setTimeout(() => {
            handleExport();
        }, 500);
        return () => clearTimeout(timeout);
    }
  }, [markedOrder, totalShards, currentIndex]);


  const changeAnimal = (delta) => {
    // 2. Clear array เมื่อเปลี่ยนสัตว์
    setMarkedOrder([]);

    setCurrentIndex((prev) => {
      const next = (prev + delta + ANIMALS.length) % ANIMALS.length;
      setDirection(next > prev ? "left" : "right");
      return next;
    });
  };

  // 3. ปรับ Logic การคลิก
  const toggleShard = (index) => {
    setMarkedOrder((prev) => {
        const existingIndex = prev.indexOf(index);
        if (existingIndex !== -1) {
            // ถ้ามีอยู่แล้ว ให้เอาออก (Unmark)
            // การเอาออกจะทำให้ลำดับของตัวหลังๆ เลื่อนขึ้นมาโดยอัตโนมัติ ซึ่งน่าจะถูกต้องตาม logic การ Mark
            return prev.filter(item => item !== index);
        } else {
            // ถ้ายังไม่มี ให้ต่อท้าย (Mark ต่อไปเป็นลำดับถัดไป)
            return [...prev, index];
        }
    });
  };

  const handleExport = () => {
    // สร้าง Object ใหม่ตาม Format
    // Format: export const [animalName] = { ... }
    
    // เรียง Shard ตามลำดับ original array แต่ใส่ order ใหม่เข้าไป
    const newShards = animal.shards.map((shard, originalIndex) => {
        // หาว่า originalIndex นี้ ถูกคลิกเป็นลำดับที่เท่าไหร่
        const orderIndex = markedOrder.indexOf(originalIndex);
        
        // ถ้าอยู่ใน markedOrder ก็ใช้ลำดับนั้น (0, 1, 2...)
        // ถ้าไม่อยู่ (กรณีอาจจะกด export manual? แต่โจทย์บอก auto เมื่อครบ)
        // ก็ใส่เป็น -1 หรือค่าเดิมไปก่อน แต่ตาม Flow นี้คือน่าจะครบแล้วทุกตัวที่เป็น visible
        const newOrder = orderIndex !== -1 ? orderIndex : shard.order;

        return {
            ...shard,
            order: newOrder
        };
    });

    // Construct String manually to preserve format and add comments
    let exportContent = `export const ${animal.id}Ordered = {\n`;
    
    // Add other properties (dynamically)
    const { shards: _ignore, ...otherProps } = animal;
    for (const [key, value] of Object.entries(otherProps)) {
        // Use JSON.stringify for value to handle strings, numbers, booleans correctly
        exportContent += `  ${key}: ${JSON.stringify(value)},\n`;
    }

    exportContent += `  shards: [\n`;

    newShards.forEach((shard, index) => {
        // Construct the object string manually to ensure desired property order
        // Required Order: clipPath, color, order, shard
        const shardObjContent = `    {\n` +
                                `      clipPath:\n` + 
                                `        ${JSON.stringify(shard.clipPath)},\n` +
                                `      color: ${JSON.stringify(shard.color)},\n` +
                                `      order: ${shard.order},\n` +
                                `      shard: ${shard.shard},\n` +
                                `    }`;
        
        exportContent += `${shardObjContent},\n\n`;
    });

    exportContent += `  ]\n};`;
    
    const blob = new Blob([exportContent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${animal.id}Ordered.js`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleMouseMove = (e) => {
    if (!showLabels || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  const ratio = stageWidth / stageHeight;

  // ใช้ pool ใหญ่สุดเผื่อไว้ก่อน
  const pool = Array.from({ length: MAX_SHARD_COUNT }, (_, i) => i);

  const shards = pool.map((i) => {
    // ต้องระวัง Index เกิน range ของสัตว์ปัจจุบัน
    const shardData = animal.shards[i];
    
    // ถ้าเกิน range ก็ไม่แสดง
    if (!shardData) return null;

    const isVisible = true; // สมมติว่าทุกอันใน config visible หมด
    const isHovered = i === hoverIndex;

    // 4. เช็คว่า Index นี้ถูกมาร์คไว้ไหม จาก Array
    const isMarked = markedOrder.includes(i);
    // หา order ปัจจุบันที่ mark (ถ้าต้องการแสดงเลข)
    const markedSequence = markedOrder.indexOf(i); 

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
      >
        {/* Optional: แสดงเลข Order ที่ Mark ไว้กลาง Shard เพื่อให้รู้ว่ากดลำดับที่เท่าไหร่แล้ว */}
        {isMarked && showLabels && (
            <span style={{
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: '12px',
                pointerEvents: 'none',
                textShadow: '0 0 2px black'
            }}>
                {markedSequence}
            </span>
        )}
      </div>
    );
  });

  let hoverLabelText = "";
  if (showLabels) {
    if (hoverIndex !== null) {
      hoverLabelText = `Shard Index: ${hoverIndex} (Click to set Order: ${markedOrder.length})`;
    } else {
      hoverLabelText = `Marked: ${markedOrder.length} / ${totalShards}`;
    }
  }

  return (
    <div className="page">
      <div className="status-bar" style={{position:'absolute', top: 10, left: 10, color: 'white', zIndex: 999}}>
         Animal: {animal.name} | Progress: {markedOrder.length} / {totalShards}
      </div>

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
        <button onClick={() => changeAnimal(-1)}>Prev</button>
        <button onClick={() => changeAnimal(1)}>Next</button>
        <button onClick={() => setShowLabels((v) => !v)}>
          {showLabels ? "Hide Numbers" : "Show Numbers"}
        </button>
        
        {/* ปุ่ม Reset เผื่อกดผิดเยอะๆ */}
        <button onClick={() => setMarkedOrder([])} style={{marginLeft: '10px', background: '#FF4444'}}>
          Reset Orders
        </button>

        {/* ปุ่ม Export Manual เผื่อลืม */}
        <button onClick={handleExport} style={{marginLeft: '10px'}}>
             Force Export
        </button>

        {showLabels && <div className="hover-label">{hoverLabelText}</div>}
      </div>
    </div>
  );
}

export default App;
