const fs = require("fs");
const path = require("path");

const srcDir =
  "C:\\Users\\pitchayapong_saelim\\.gemini\\antigravity\\brain\\c66a3f80-5b78-4abb-b6f7-29e8446d83f6";
const destDir = path.join(__dirname, "public", "carousel");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
files.forEach((file) => {
  if (file.endsWith(".png")) {
    const match = file.match(/^(.+)_([12])_(\d+)\.png$/);
    if (match) {
      const newName = `${match[1]}_${match[2]}.png`;
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, newName);
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Successfully copied ${file} to ${newName}`);
      } catch (err) {
        console.error(`Failed to copy ${file}: ${err.message}`);
      }
    }
  }
});
