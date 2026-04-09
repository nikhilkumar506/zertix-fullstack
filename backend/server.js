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

// ================= 🔥 SITEMAP (VERY IMPORTANT) =================

app.get("/sitemap.xml", (req, res) => {

  res.header("Content-Type", "application/xml");

  res.send(`
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

      <url><loc>https://zertix.in/</loc></url>

      <url><loc>https://zertix.in/mcqs/cpp</loc></url>
      <url><loc>https://zertix.in/mcqs/dbms</loc></url>
      <url><loc>https://zertix.in/mcqs/accounting</loc></url>
      <url><loc>https://zertix.in/mcqs/os</loc></url>
      <url><loc>https://zertix.in/mcqs/ob</loc></url>
      <url><loc>https://zertix.in/mcqs/it</loc></url>
      <url><loc>https://zertix.in/mcqs/cg</loc></url>
      <url><loc>https://zertix.in/mcqs/se</loc></url>
      <url><loc>https://zertix.in/mcqs/ot</loc></url>
      <url><loc>https://zertix.in/mcqs/cyber</loc></url>
      <url><loc>https://zertix.in/mcqs/datascience</loc></url>
      <url><loc>https://zertix.in/mcqs/ecommerce</loc></url>
      <url><loc>https://zertix.in/mcqs/iot</loc></url>

    </urlset>
  `);
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