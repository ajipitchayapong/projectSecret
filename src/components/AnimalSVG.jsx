import React, { useMemo } from "react";
import { ANIMALS } from "../data/animalConfig";

/**
 * AnimalSVG renders a polygon animal using a single SVG element.
 * It converts the percentage-based clipPath data from animalConfig.js
 * into SVG <polygon> elements.
 */
const AnimalSVG = ({ animalId, className = "", style = {} }) => {
  const animal = useMemo(
    () => ANIMALS.find((a) => a.id === animalId),
    [animalId],
  );

  if (!animal) return null;

  // Process shards to extract points for SVG polygons
  const polygons = useMemo(() => {
    return animal.shards
      .map((shard) => {
        // clipPath format: "polygon(x1% y1%, x2% y2%, ...)"
        const pointsMatch = shard.clipPath.match(/polygon\((.*)\)/);
        if (!pointsMatch) return null;

        const pointsStr = pointsMatch[1];
        // Convert "7.313% 48.222%, 7.688% 52.444%" -> "7.313 48.222 7.688 52.444"
        const points = pointsStr.replace(/%/g, "").replace(/,/g, "").trim();

        return {
          points,
          color: shard.color,
          order: shard.order,
        };
      })
      .filter(Boolean);
  }, [animal]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`animal-svg ${className}`}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        ...style,
      }}
    >
      {polygons.map((poly, idx) => (
        <polygon
          key={idx}
          points={poly.points}
          fill={poly.color}
          stroke={poly.color} // Add subtle stroke to prevent gaps between triangles
          strokeWidth="0.05"
        />
      ))}
    </svg>
  );
};

export default AnimalSVG;
