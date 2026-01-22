const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const adminAuth = require("../middlewares/adminAuth");

router.post("/", adminAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(201).json({
    url: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
