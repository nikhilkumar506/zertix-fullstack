require("dotenv").config();

const express = require("express");
const path = require("path");

// ✅ Import app
const app = require("./src/app");

// ✅ DB connect
const connectDB = require("./src/config/db");
connectDB().catch(err => {
  console.log("❌ MongoDB Error:", err.message);
});

// ================= FRONTEND =================

const FRONTEND_PATH = path.resolve(__dirname, "frontend");

// Static files
app.use(express.static(FRONTEND_PATH));

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"));
});

// MCQs main page
app.get("/mcqs", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/index.html"));
});

// MCQ single page
app.get("/mcq.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "pages/mcqs/mcq.html"));
});

// Smart redirect
app.get("/mcq", (req, res) => {
  res.redirect("/mcq.html?" + (req.url.split("?")[1] || ""));
});

// ================= 🔥 SEO ROUTE =================

app.get("/mcqs/:subject", (req, res) => {

  let subject = req.params.subject;

  // ✅ FIX for C++
  if (subject === "c++" || subject === "c%2B%2B") {
    subject = "cpp";
  }

  const formatted = subject
    .replace(/-/g, " ")
    .toUpperCase();

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formatted} MCQ Questions with Answers | Zertix</title>
      <meta name="description" content="Practice ${formatted} MCQs online free with answers.">
    </head>

    <body style="font-family:sans-serif; padding:20px;">

      <h1>${formatted} MCQ Questions with Answers</h1>

      <p>
        Practice ${formatted} MCQs for exams, placements and interviews.
      </p>

      <h2>Free ${formatted} MCQ Test</h2>

      <p>
        These questions are important for preparation.
      </p>

      <br>

      <a href="/mcq.html?subject=${subject}">
        Start ${formatted} Test 🚀
      </a>

    </body>
    </html>
  `);
});

// ================= 🔥 VALID SITEMAP =================

app.get("/sitemap.xml", (req, res) => {

  res.setHeader("Content-Type", "application/xml");

  const urls = [
    "",
    "mcqs/cpp",
    "mcqs/dbms",
    "mcqs/accounting",
    "mcqs/os",
    "mcqs/ob",
    "mcqs/it",
    "mcqs/cg",
    "mcqs/se",
    "mcqs/ot",
    "mcqs/cyber",
    "mcqs/datascience",
    "mcqs/ecommerce",
    "mcqs/iot"
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>https://zertix.in/${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`).join("")}
</urlset>`;

  res.send(xml);
});

// ================= 404 =================

app.use((req, res) => {
  res.status(404).send("❌ Route Not Found");
});

// ================= SERVER =================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
