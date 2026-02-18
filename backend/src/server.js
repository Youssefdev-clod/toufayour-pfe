// backend/src/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

// Routes
const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");
const uploadRoutes = require("./routes/upload.routes"); // إذا عندك upload

const app = express();

/* =========================
   Middlewares
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/orders", ordersRoutes);

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* =========================
   Test DB connection (important)
========================= */
db.query("SELECT 1 AS test")
  .then((r) => console.log("✅ DB test OK:", r.recordset))
  .catch((e) => console.error("❌ DB test FAILED:", e.message));

/* =========================
   Routes
========================= */
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/upload", uploadRoutes); // إذا عندك route upload

// Health check
app.get("/", (req, res) => {
  res.json({ status: "API is running 🚀" });
});

/* =========================
   Start server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
