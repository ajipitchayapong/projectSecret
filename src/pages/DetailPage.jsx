import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ANIMALS } from "../data/animalConfig";
import Button from "../components/Button";
import "./DetailPage.css";

const MAX_SHARD_COUNT = Math.max(...ANIMALS.map((a) => a.shards.length));
const DURATION = 1.0;
const STAGGER = 0.015;

// Import Assets Removed

function DetailPage() {
  const levels = ANIMALS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const [showLabels, setShowLabels] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Import State

  // 1. เปลี่ยนจาก Set เป็น Array เพื่อเก็บลำดับการคลิก (Order)
  const [markedOrder, setMarkedOrder] = useState([]);

  const [mousePos, setMousePos] = useState(null);
  const stageRef = useRef(null);

  const animal = levels[currentIndex];
  // หาจำนวน Shard จริงๆ ของสัตว์ตัวปัจจุบัน (ไม่นับ Shard ที่อาจจะเป็น null/disabled ถ้ามี)
  // แต่จาก config ดูเหมือนจะเต็ม array แต่เราสามารถใช้ length ของ animal.shards ได้เลย
  const totalShards = animal?.shards?.length || 0;

  const handleExport = useCallback(() => {
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
        order: newOrder,
        shard: shard.shard ?? originalIndex + 1,
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
      const shardObjContent =
        `    {\n` +
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
  }, [animal, markedOrder]);

  // Effect สำหรับเช็คว่าครบหรือยัง แล้ว Auto Export
  useEffect(() => {
    if (markedOrder.length > 0 && markedOrder.length === totalShards) {
      // ให้เวลา State Update และ Render แป๊บนึงก่อน Export
      const timeout = setTimeout(() => {
        handleExport();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [markedOrder, totalShards, currentIndex, handleExport]);

  const changeAnimal = (delta) => {
    // 2. Clear array เมื่อเปลี่ยนสัตว์
    setMarkedOrder([]);

    setCurrentIndex((prev) => {
      const next = (prev + delta + levels.length) % levels.length;
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
        return prev.filter((item) => item !== index);
      } else {
        // ถ้ายังไม่มี ให้ต่อท้าย (Mark ต่อไปเป็นลำดับถัดไป)
        return [...prev, index];
      }
    });
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

  // Memoize the rank of each shard based on its order
  // This ensures animation starts at 0 and flows smoothly even if order values are sparse or high
  const shardRanks = useMemo(() => {
    if (!animal?.shards) return [];
    const withIndex = animal.shards.map((s, i) => ({
      originalIndex: i,
      order: typeof s.order === "number" ? s.order : i,
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

  const shards = pool.map((i) => {
    // ต้องระวัง Index เกิน range ของสัตว์ปัจจุบัน
    const shardData = animal.shards[i];

    // ถ้าเกิน range ก็แสดงเป็นตัว invisible เพื่อให้ transition สวย
    const isVisible = !!shardData;
    const isHovered = i === hoverIndex;

    // 4. เช็คว่า Index นี้ถูกมาร์คไว้ไหม จาก Array
    const isMarked = markedOrder.includes(i);
    // หา order ปัจจุบันที่ mark (ถ้าต้องการแสดงเลข)
    const markedSequence = markedOrder.indexOf(i);

    // Use normalized rank for animation to prevent large delays if orders are high numbers
    const rank = shardRanks[i] ?? i;

    const orderIndex = direction === "left" ? rank : totalShards - 1 - rank;

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

    // Random scatter position for invisible shards based on index
    // Using Math.sin/cos with index ensures consistent 'random' positions
    const angle = i * 137.5 * (Math.PI / 180); // Golden angle for distribution
    const radius = 600 + (i % 10) * 100; // Varying distance (increased range)
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;
    const rot = (i * 45) % 360;

    const currentTransform = isVisible
      ? "translate(0px, 0px) rotate(0deg)"
      : `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

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
          transform: currentTransform,

          transition: `
            clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            -webkit-clip-path ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1),
            opacity 0.4s ${delay}s ease-out,
            background-color 0s 0s linear,
            transform ${DURATION}s ${delay}s cubic-bezier(0.25, 0.8, 0.25, 1)
          `,
        }}
      >
        {/* Optional: แสดงเลข Order ที่ Mark ไว้กลาง Shard เพื่อให้รู้ว่ากดลำดับที่เท่าไหร่แล้ว */}
        {isMarked && showLabels && (
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
              pointerEvents: "none",
              textShadow: "0 0 2px black",
            }}
          >
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
    <div
      className="detail-page"
      style={{
        background:
          "radial-gradient(circle at 50% 100%, #1e1b4b 0%, #0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: "absolute",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 2, // Above bg images
        }}
      />

      {/* Top Bar (Progress & Info) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          pointerEvents: "none", // Click through to stage if needed
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ←
            </div>
            <span style={{ fontWeight: 600, letterSpacing: "1px" }}>BACK</span>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {animal.name}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "5px",
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <span>Progress</span>
            <div
              style={{
                width: "150px",
                height: "4px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(markedOrder.length / totalShards) * 100}%`,
                  height: "100%",
                  background: "#6366f1",
                  boxShadow: "0 0 10px #6366f1",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <span>
              {markedOrder.length} / {totalShards}
            </span>
          </div>
        </div>
        <div style={{ width: "80px" }}></div> {/* Spacer for alignment */}
      </div>

      {/* Main Stage */}
      <div
        className="detail-stage-wrapper"
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos(null)}
        style={{
          "--ratio": ratio,
          zIndex: 10,
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))",
        }}
      >
        <div
          className="detail-stage-inner"
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

      {/* Bottom HUD Controls */}
      <div
        className="controls"
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "16px",
          padding: "12px",
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          zIndex: 100,
          alignItems: "center",
        }}
      >
        <Button onClick={() => changeAnimal(-1)} variant="secondary">
          Prev
        </Button>

        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Button
          onClick={() => setShowLabels((v) => !v)}
          variant={showLabels ? "primary" : "secondary"}
        >
          {showLabels ? "Hide Numbers" : "Show Numbers"}
        </Button>

        <Button
          onClick={() => setMarkedOrder([])}
          variant="secondary"
          style={{ color: "#f87171" }}
        >
          Reset
        </Button>

        <Button onClick={handleExport} variant="secondary">
          Export
        </Button>

        <div
          style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.1)",
          }}
        />

        <Button onClick={() => changeAnimal(1)} variant="primary">
          Next Animal
        </Button>
      </div>

      {/* Hover Tooltip/Info */}
      {showLabels && (
        <div
          className="hover-label"
          style={{
            position: "fixed",
            bottom: "120px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.8)",
            padding: "8px 16px",
            borderRadius: "8px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {hoverLabelText}
        </div>
      )}
    </div>
  );
}

export default DetailPage;
