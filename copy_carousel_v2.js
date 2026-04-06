const fs = require("fs");
const path = require("path");

const srcDir =
  "C:\\Users\\pitchayapong_saelim\\.gemini\\antigravity\\brain\\c66a3f80-5b78-4abb-b6f7-29e8446d83f6";
const destDir = "d:\\React\\polygon-animals\\public\\carousel";

console.log(`Starting copy from ${srcDir} to ${destDir}`);

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory ${destDir}`);
}

try {
  const files = fs.readdirSync(srcDir);
  console.log(`Found ${files.length} files in source directory`);

  files.forEach((file) => {
    if (file.endsWith(".png")) {
      // Pattern: [name]_[index]_[timestamp].png
      const match = file.match(/^(.+)_([12])_(\d+)\.png$/);
      if (match) {
        const newName = `${match[1]}_${match[2]}.png`;
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, newName);
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to ${newName}`);
      } else {
        console.log(`Skipping non-pattern file: ${file}`);
      }
    }
  });
  console.log("Copy operation completed.");
} catch (err) {
  console.error(`Error during copy: ${err.message}`);
}
