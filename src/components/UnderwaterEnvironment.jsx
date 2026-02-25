import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Menu Click Shard Explosion Component (Triangular Shards)
export const ShardExplosion = ({ x, y, onComplete }) => {
  const shards = useMemo(() => {
    const colors = ["#ffffff", "#7dd3fc", "#38bdf8", "#2dd4bf"];
    return [...Array(10)].map((_, i) => ({
      id: i,
      angle: (i / 10) * Math.PI * 2 + Math.random() * 0.5,
      speed: Math.random() * 120 + 60,
      size: Math.random() * 14 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="shard-explosion-container" style={{ left: x, top: y }}>
      {shards.map((s, i) => (
        <motion.div
          key={s.id}
          className="click-shard"
          initial={{ x: 0, y: 0, opacity: 1, rotate: s.rotation, scale: 1 }}
          animate={{
            x: Math.cos(s.angle) * s.speed,
            y: Math.sin(s.angle) * s.speed,
            opacity: 0,
            rotate: s.rotation + 360,
            scale: 0.2,
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 8px ${s.color}66`,
          }}
        />
      ))}
    </div>
  );
};

// Floating Low-Poly Background Shards (Crystal Bubbles)
export const BackgroundShards = () => {
  const shards = useMemo(() => {
    const colors = ["#ffffff", "#7dd3fc", "#38bdf8", "#0ea5e9", "#2dd4bf"];
    return [...Array(20)].map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 15,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10,
      opacity: Math.random() * 0.15 + 0.05,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      offset: Math.random() * 40 - 20,
    }));
  }, []);

  return (
    <div className="background-shards-layer">
      {shards.map((s) => (
        <motion.div
          key={s.id}
          className="bg-shard"
          style={{
            width: s.size,
            height: s.size,
            left: s.left,
            opacity: s.opacity,
            rotate: s.rotate,
            backgroundColor: s.color,
            boxShadow: `0 0 10px ${s.color}44`,
          }}
          animate={{
            y: ["110vh", "-10vh"],
            rotate: [s.rotate, s.rotate + 360],
            x: [0, s.offset, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Bioluminescent Particles (Plankton)
export const VibrantParticles = () => {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 5,
      offsetX: Math.random() * 30 - 15,
      offsetY: Math.random() * 30 - 15,
    }));
  }, []);

  return (
    <div className="vibrant-particles-layer">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="bio-particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
            x: [0, p.offsetX],
            y: [0, p.offsetY],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Geometric Decorations specifically for the Modal
export const ModalDecorations = () => {
  return (
    <div className="modal-decor-layer">
      {/* Corner Brackets */}
      <div className="modal-corner top-left" />
      <div className="modal-corner top-right" />
      <div className="modal-corner bottom-left" />
      <div className="modal-corner bottom-right" />

      {/* Subtle floating shards inside modal */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="modal-shard"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
          style={{
            top: `${15 + ((i * 12) % 70)}%`,
            left: i % 2 === 0 ? `${2 + (i % 3) * 5}%` : `${85 + (i % 3) * 3}%`,
            width: 50 + (i % 5) * 15,
            height: 50 + (i % 5) * 15,
          }}
        />
      ))}
    </div>
  );
};

// Sunlight Piercing Effect Wrapper
export const SurfaceGlow = () => <div className="surface-glow" />;

const UnderwaterEnvironment = () => {
  return (
    <>
      <BackgroundShards />
      <VibrantParticles />
      <SurfaceGlow />
    </>
  );
};

export default UnderwaterEnvironment;
