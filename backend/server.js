require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
const path = require("path");

// serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});