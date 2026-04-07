const fs = require("fs");

const file = fs.readFileSync("cpp.csv", "utf-8");
const lines = file.split("\n");

const result = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const cols = lines[i].split(",");

  // 🔥 smart extraction from END
  const topic = cols.pop()?.trim();
  const explanation = cols.pop()?.trim();
  const answer = Number(cols.pop());

  const subject = cols.shift()?.trim();
  const q = cols.shift()?.trim();

  const options = cols.map(opt => opt.trim());

  while (options.length < 4) options.push("None");
  const finalOptions = options.slice(0, 4);

  result.push({
    subject,
    q,
    options: finalOptions,
    answer,
    explanation,
    topic
  });
}

fs.writeFileSync("all.json", JSON.stringify(result, null, 2));

console.log(" Smart JSON generated");