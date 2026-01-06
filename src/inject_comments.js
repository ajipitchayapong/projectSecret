import fs from 'fs';

const filePath = 'src/animalConfig.js';
let content = fs.readFileSync(filePath, 'utf8');

// Goal: Convert `// shard X` comments into `shard: X,` properties inside the object.

// Case 1: Prefix comments (Orca style)
// "      // shard 1"
// "      {"
// Result: "      // shard 1\n      { shard: 1,"
// Regex: /(\s*)\/\/ shard (\d+)\r?\n(\s*)\{/g
// Replacement: $1// shard $2\n$3{ shard: $2,

let newContent = content.replace(/(\s*)\/\/ shard (\d+)\r?\n(\s*)\{/g, (match, indent1, num, indent2) => {
    return `${indent1}// shard ${num}\n${indent2}{ shard: ${num},`;
});

// Case 2: Suffix comments (Turtle style)
// "      }, // shard 1"
// Result: "      shard: 1,\n      }, // shard 1"
// Note: We need to insert `shard: 1,` BEFORE the closing brace.
// Regex: /(\s*)\}, \/\/ shard (\d+)/g
// Replacement: \n$1  shard: $2,\n$1}, // shard $2

newContent = newContent.replace(/(\s*)\}, \/\/ shard (\d+)/g, (match, indent, num) => {
    return `\n${indent}  shard: ${num},\n${indent}}, // shard ${num}`;
});

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Converted comments to properties in animalConfig.js");
