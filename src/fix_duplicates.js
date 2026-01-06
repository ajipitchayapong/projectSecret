import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'animalConfig.js');

let content = fs.readFileSync(configPath, 'utf8');

// The strategy:
// 1. Identify `shards: [...]` blocks.
// 2. Iterate through each shard object.
// 3. Remove all `shard: ...` lines.
// 4. Insert `shard: ID` after `order: ...`
// 5. ID should be sequential based on array index (1-based).

// Split by animal blocks roughly
// Actually better to iterate through the string and find Shard blocks
// Regex to find shard objects is tricky because of nested braces if any (but here likely not)
// However, simpler: Split by "shards: ["
// Then process the content inside the brackets.

const parts = content.split('shards: [');
let newContent = parts[0];

for (let i = 1; i < parts.length; i++) {
    // Find the closing bracket of the shards array
    // This is naive if there are nested arrays, but shard objects don't have arrays usually
    // Let's count brackets to find the end of `shards: [...]`
    
    let depth = 1;
    let endIndex = 0;
    const currentPart = parts[i];
    
    for (let j = 0; j < currentPart.length; j++) {
        if (currentPart[j] === '[') depth++;
        if (currentPart[j] === ']') depth--;
        if (depth === 0) {
            endIndex = j;
            break;
        }
    }
    
    const shardsBlock = currentPart.substring(0, endIndex);
    const rest = currentPart.substring(endIndex);
    
    // Process each shard object inside `shardsBlock`
    // We can assume they are separated by commas and enclosed in {}
    // But basic regex replacement might be safer if we target "order: N,"
    
    // Split by "{" to find start of objects?
    // Let's iterate using a regex that matches the *content* of each object.
    // Or just Replace `shard: ...` globally WITHIN this block?
    // No, we need to inject sequential IDs.
    
    // Let's reconstruct the shards block entirely.
    // It's a list of objects.
    // Regex to find each object: /{[^}]+}/g  (assuming no nested braces in object)
    // clipPath uses strings, might have braces? No, polygon string uses parentheses.
    
     let shardIndex = 1;
     const newShardsBlock = shardsBlock.replace(/\{[^{}]+\}/g, (match) => {
         // match is the entire object string e.g. { clipPath: ..., color: ..., order: ..., shard: ... }
         
         // 1. Remove existing shard lines
         let cleanMatch = match.replace(/\s*shard:\s*\d+,?/g, '');
         
         // 2. Insert new shard line after order line
         // We expect `order: N,` to exist.
         if (cleanMatch.includes('order:')) {
             cleanMatch = cleanMatch.replace(/(order:\s*\d+,?)/, `$1\n        shard: ${shardIndex},`);
         } else {
             // If no order, append at end before } (unlikely based on file)
             cleanMatch = cleanMatch.replace(/\s*}/, `\n        shard: ${shardIndex},\n      }`);
         }
         
         shardIndex++;
         return cleanMatch;
     });
     
     newContent += 'shards: [' + newShardsBlock + rest;
}

fs.writeFileSync(configPath, newContent);
console.log('Fixed duplicate shard properties in animalConfig.js');
