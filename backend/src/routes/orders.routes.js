// backend/src/routes/orders.routes.js
const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const orders = require("../controllers/orders.controller");

// Public
router.post("/", orders.createOrder);

// Admin
router.get("/", adminAuth, orders.getOrders);
router.get("/:id", adminAuth, orders.getOrderById);
router.patch("/:id/status", adminAuth, orders.updateOrderStatus);

module.exports = router;
