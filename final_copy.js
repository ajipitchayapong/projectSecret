const fs = require("fs");
const path = require("path");

const srcDir =
  "C:/Users/pitchayapong_saelim/.gemini/antigravity/brain/c66a3f80-5b78-4abb-b6f7-29e8446d83f6";
const destDir = "d:/React/polygon-animals/public/carousel";

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach((file) => {
  if (file.endsWith(".png") && !file.startsWith("media__")) {
    // Pattern: [animal_id]_[index]_[timestamp].png
    const match = file.match(/^(.+)_([12])_(\d+)\.png$/);
    if (match) {
      const newName = `${match[1]}_${match[2]}.png`;
      fs.copyFileSync(path.join(srcDir, file), path.join(destDir, newName));
      console.log(`Copied ${file} to ${newName}`);
    }
  }
});
