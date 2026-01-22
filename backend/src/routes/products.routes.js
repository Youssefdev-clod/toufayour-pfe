const express = require("express");
const router = express.Router();
const productsCtrl = require("../controllers/products.controller");
const adminAuth = require("../middlewares/adminAuth");

router.get("/", productsCtrl.getAll);
router.get("/:id", productsCtrl.getOne);

router.post("/", adminAuth, productsCtrl.create);
router.put("/:id", adminAuth, productsCtrl.update);
router.delete("/:id", adminAuth, productsCtrl.remove);

module.exports = router;
