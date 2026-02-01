export const parseSVG = async (svgString, name) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) {
    throw new Error("Invalid SVG: No <svg> tag found.");
  }

  // 1. Determine Dimensions (ViewBox or Width/Height)
  let width = 1600;
  let height = 900;

  const viewBox = svgEl.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/).map(parseFloat);
    if (parts.length === 4) {
      width = parts[2];
      height = parts[3];
    }
  } else {
    const w = parseFloat(svgEl.getAttribute("width"));
    const h = parseFloat(svgEl.getAttribute("height"));
    if (!isNaN(w)) width = w;
    if (!isNaN(h)) height = h;
  }

  // 2. User provided parsing logic (Exact copy)
  
  /**
   * NEW parse: รองรับ M, L, H, V, Z
   * H x → y เดิม
   * V y → x เดิม
   * L x y → ตามปกติ
   * M x y → move (ใช้เป็นจุดแรก)
   */
  function parsePoints(d) {
    const tokens = d.match(/[MLHVZmlhvz]|-?\d*\.?\d+/g);

    let pts = [];
    let i = 0;
    let curr = { x: 0, y: 0 }; // keep current position

    while (i < tokens.length) {
      const cmd = tokens[i++];

      switch (cmd) {
        case "M":
        case "L": {
          const x = parseFloat(tokens[i++]);
          const y = parseFloat(tokens[i++]);
          curr = { x, y };
          pts.push({ ...curr });
          break;
        }

        case "H": {
          const x = parseFloat(tokens[i++]);
          curr = { x, y: curr.y };
          pts.push({ ...curr });
          break;
        }

        case "V": {
          const y = parseFloat(tokens[i++]);
          curr = { x: curr.x, y };
          pts.push({ ...curr });
          break;
        }

        case "Z":
        case "z":
          // close path: เอาจุดแรกกลับมาเพื่อความชัดเจน
          if (pts.length > 0) pts.push({ ...pts[0] });
          break;

        default:
          // ตัวเลขหลุดมานำหน้า (rare case) → ถือเป็น L
          if (!isNaN(parseFloat(cmd))) {
            const x = parseFloat(cmd);
            const y = parseFloat(tokens[i++]);
            curr = { x, y };
            pts.push({ ...curr });
          }
          break;
      }
    }

    return pts;
  }

  function toPercent({ x, y }) {
    return {
      x: (x / width) * 100,
      y: (y / height) * 100,
    };
  }

  // 3. Parse Paths
  const shards = [];
  const paths = Array.from(doc.querySelectorAll("path"));

  paths.forEach((p, index) => {
    const d = p.getAttribute("d");
    const fill = p.getAttribute("fill") || "#000000"; 
    
    if (!d) return;

    try {
        const points = parsePoints(d);
        
        if (points && points.length > 0) {
            const percentPts = points.map(toPercent);
            const polyString = `polygon(${percentPts
                .map(pt => `${pt.x.toFixed(3)}% ${pt.y.toFixed(3)}%`)
                .join(", ")})`;
            
            shards.push({
                clipPath: polyString,
                color: fill,
                order: index, 
                shard: index + 1
            });
        }
    } catch (e) {
        console.warn("Error parsing path", index, e);
    }
  });
  
  // Format Name: First char uppercase
  const rawName = name || "custom";
  const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const formattedId = rawName.toLowerCase().replace(/\s+/g, '-');

  // Return the new Animal Object
  return {
    id: formattedId, 
    name: formattedName,
    stageWidth: width,
    stageHeight: height,
    shards: shards
  };
};
