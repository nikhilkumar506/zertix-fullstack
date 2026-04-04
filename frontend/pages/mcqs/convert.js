const fs = require("fs");

const file = fs.readFileSync("cpp.csv", "utf-8");
const lines = file.split("\n");

const result = [];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const [subject, q, A, B, C, D, answer, explanation, topic] =
    lines[i].split(",");

  result.push({
    subject: subject.trim(),
    q: q.trim(),
    options: [A, B, C, D],
    answer: Number(answer),
    explanation: explanation.trim(),
    topic: topic?.trim()
  });
}

fs.writeFileSync("all.json", JSON.stringify(result, null, 2));

console.log("✅ JSON generated");