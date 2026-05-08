require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

// ✅ Import app
const app = require("./src/app");

// ✅ DB connect
const connectDB = require("./src/config/db");

connectDB().catch(err => {
  console.log("❌ MongoDB Error:", err.message);
});

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

/* ================= ROUTES ================= */

const resumeRoutes = require("./src/routes/resumeRoutes");
const atsRoutes = require("./src/routes/atsRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const templateRoutes = require("./src/routes/templateRoutes");

/* ================= FRONTEND ================= */

const FRONTEND_PATH = path.resolve(__dirname, "frontend");

// Static frontend
app.use(express.static(FRONTEND_PATH));

// Uploads static
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "src/uploads")
  )
);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(
    path.join(FRONTEND_PATH, "index.html")
  );
});

// ================= MCQ ROUTES =================

// MCQs main page
app.get("/mcqs", (req, res) => {
  res.sendFile(
    path.join(
      FRONTEND_PATH,
      "pages/mcqs/index.html"
    )
  );
});

// MCQ single page
app.get("/mcq.html", (req, res) => {
  res.sendFile(
    path.join(
      FRONTEND_PATH,
      "pages/mcqs/mcq.html"
    )
  );
});

// Smart redirect
app.get("/mcq", (req, res) => {

  res.redirect(
    "/mcq.html?" +
    (req.url.split("?")[1] || "")
  );
});

/* ================= RESUME BUILDER APIs ================= */

app.use("/api/resumes", resumeRoutes);

app.use("/api/ats", atsRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/templates", templateRoutes);

/* ================= SEO ROUTE ================= */

app.get("/mcqs/:subject", (req, res) => {

  let subject = req.params.subject;

  // ✅ FIX FOR C++
  if (
    subject === "c++" ||
    subject === "c%2B%2B"
  ) {
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

      <meta
        name="description"
        content="Practice ${formatted} MCQs online free with answers."
      >
    </head>

    <body style="font-family:sans-serif; padding:20px;">

      <h1>${formatted} MCQ Questions with Answers</h1>

      <p>
        Practice ${formatted} MCQs
        for exams, placements and interviews.
      </p>

      <h2>Free ${formatted} MCQ Test</h2>

      <p>
        These questions are important
        for preparation.
      </p>

      <br>

      <a href="/mcq.html?subject=${subject}">
        Start ${formatted} Test 🚀
      </a>

    </body>
    </html>
  `);
});

/* ================= SITEMAP ================= */

app.get("/sitemap.xml", (req, res) => {

  res.setHeader(
    "Content-Type",
    "application/xml"
  );

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

    <lastmod>
      ${new Date().toISOString()}
    </lastmod>

    <changefreq>daily</changefreq>

    <priority>0.8</priority>
  </url>
`).join("")}

</urlset>`;

  res.send(xml);
});

/* ================= 404 ================= */

app.use((req, res) => {

  res.status(404).send(
    "❌ Route Not Found"
  );
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );
});