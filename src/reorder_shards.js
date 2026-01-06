import fs from 'fs';

const filePath = 'src/animalConfig.js';
let content = fs.readFileSync(filePath, 'utf8');

// The file corresponds to:
// {
//   ...
//   order: 72,
//   shard: 2,
// }, // shard 2
// { shard: 2,
//   clipPath: ...
// }

// The user has "doubled" the shard property or misplaced it.
// We want to standardise:
// {
//   clipPath: ...,
//   color: ...,
//   order: ...,
//   shard: ...,
// }

// Step 1: Read the file.
// Step 2: Use Regex to clean up.

// Remove `shard: \d+,` that appears at the BEGINNING of an object.
// Pattern: `{ shard: \d+,`
// We want to remove `shard: \d+,` part.
content = content.replace(/\{\s*shard:\s*\d+,\s*/g, '{\n        ');

// Remove `shard: \d+,` that appears elsewhere, we will re-insert it properly.
// Wait, we need to CAPTURE the value.
// But some objects have it correct (at end), some incorrect?
// The user edits show:
// Shard 1: `order: 70,\n shard: 1, }, // shard 1` -> OK.
// Shard 2: `{ shard: 1, \n clipPath...` -> BAD (Wrong ID too! It says shard 1 but it's the second block? No, line 22 says `{ shard: 1,`)
// Wait, look at line 22 in View File output:
// `22:       { shard: 1,`
// `30:       }, // shard 2`
// This block IS `shard 2` (based on comment). But property says `shard: 1`.
// This is because the user likely copy-pasted or the regex/manual edit was applied sequentially blindly.

// WE NEED TO FIX THE IDs to match the comments!
// Comment `// shard X` is the source of truth.

// Strategy:
// 1. Remove ALL `shard: \d+,` entries inside the blocks.
// 2. Re-inject `shard: X` based on the trailing comment `// shard X`.

// Removing existing `shard: ...` keys.
// Regex: `\s*shard:\s*\d+,` -> empty string.
content = content.replace(/\s*shard:\s*\d+,/g, '');

// Re-inject `shard: X` after `order: ...` based on comment.
// We need to look-ahead for the comment?
// Or iterate structure?

// Structure:
// ...
// order: 72,
// }, // shard 2

// But `order` is inside. The comment is outside.
// We can use the logic:
// Search for `order: \d+,` ... `}, // shard (\d+)`
// And insert `shard: $1,` after `order`.

// Because `order` should be the last property before closing brace (usually).
// Let's assume the block ends with `}, // shard N`.
// We need to find the `order: ...` property associated with that block.
// Since Javascript `replace` processes sequentially, we can try matching valid blocks.

// Regex:
// (order:\s*\d+,)([^}]*?)\}, \/\/ shard (\d+)
// This captures `order: ...` ($1), any content until closing brace ($2), and the shard ID ($3).
// We want to replace with:
// $1\n        shard: $3,$2}, // shard $3

// Let's try this.
// Note: `[^}]*?` matches everything between order and `}`.
// Usually `order` is last, so $2 is just whitespace.
// If `order` is not last, $2 contains other props.
// User requirement: "shard: ต้องต่อกับ order: เท่านั้น" implies `shard` follows `order`.

let newContent = content.replace(/(order:\s*\d+,)([^}]*?)\}, \/\/ shard (\d+)/g, (match, orderPart, between, shardNum) => {
    // orderPart: "order: 70,"
    // between: "\n      " (whitespace)
    // shardNum: "1"
    
    // Result: "order: 70,\n        shard: 1,\n      }, // shard 1"
    return `${orderPart}\n        shard: ${shardNum},${between}}, // shard ${shardNum}`;
});

// Also handle the Orca case (Prefix comments).
// Orca:
// // shard 1
// {
//   clipPath: ...
//   order: ...
// }
// (No suffix comment)

// We need to handle this pattern too.
// Match: `// shard (\d+)\s*\{` ... `order: \d+,` ... `}`
// Harder because `order` is far away.

// Alternative:
// Remove ALL `shard: ...` properties first (Done above).
// Iterate `// shard (\d+)`
// If it is suffix style `}, // shard 1`:
//    Find the preceding `order: ...` and inject.
// If it is prefix style `// shard 1 \n {`:
//    Find the following `order: ...` and inject.

// Let's implement this 2-pass approach.

// 1. Remove all `shard: ...` keys. (already done regex above)

// 2. Handle Prefix style (Orca)
// `// shard 1` followed by `{`
// regex: /(\/\/ shard (\d+)\s*\{[\s\S]*?)(order:\s*\d+,)/g
// Replace with $1$3\n        shard: $2,

// We need to be careful not to match too much. `[\s\S]*?` is non-greedy.
// It should match until the first `order:` inside that block.

newContent = newContent.replace(/(\/\/ shard (\d+)\s*\{[\s\S]*?)(order:\s*\d+,)/g, (match, blockStart, shardNum, orderPart) => {
    // blockStart includes "// shard 1 ... {"
    return `${blockStart}${orderPart}\n        shard: ${shardNum},`;
});

// 3. Handle Suffix style (Turtle)
// regex: /(order:\s*\d+,)([^}]*?)\}, \/\/ shard (\d+)/g
// (Same as before)

newContent = newContent.replace(/(order:\s*\d+,)([^}]*?)\}, \/\/ shard (\d+)/g, (match, orderPart, between, shardNum) => {
    return `${orderPart}\n        shard: ${shardNum},${between}}, // shard ${shardNum}`;
});

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Reordered shard properties in animalConfig.js");
