const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const upload = require("../middlewares/upload");
const controller = require("../controllers/products.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// إنشاء منتج مع صورة
router.post("/", adminAuth, upload.single("image"), controller.create);

module.exports = router;
