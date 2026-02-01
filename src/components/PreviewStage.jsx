import React, { useEffect, useState } from 'react';

// Simplified stage for Landing Page (auto-playing or static)
const PreviewStage = ({ animal, scale = 1, opacity = 1 }) => {
  const [visibleShards, setVisibleShards] = useState(0);
  
  // Auto-reveal effect
  useEffect(() => {
    setVisibleShards(0);
    const interval = setInterval(() => {
        setVisibleShards(prev => {
            if (prev >= animal.shards.length) {
                clearInterval(interval);
                return prev;
            }
            return prev + 2; // Speed of reveal
        });
    }, 20);
    return () => clearInterval(interval);
  }, [animal]);

  // ViewBox calculations
  const stageWidth = animal.stageWidth ?? 1000;
  const stageHeight = animal.stageHeight ?? 1000;
  
  return (
    <div style={{
       width: '100%',
       height: '100%',
       position: 'relative',
       opacity: opacity,
       transform: `scale(${scale})`,
       transition: 'opacity 1s ease',
       filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
    }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: `${(stageHeight/stageWidth)*100}%` }}>
         {animal.shards.map((shard, i) => (
             <div
                key={i}
                style={{
                    position: 'absolute',
                    top: 0, 
                    left: 0,
                    width: '100%',
                    height: '100%',
                    clipPath: shard.clipPath,
                    backgroundColor: shard.color,
                    opacity: i < visibleShards ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    zIndex: shard.order // Use order for layering
                }}
             />
         ))}
      </div>
    </div>
  );
};

export default PreviewStage;
