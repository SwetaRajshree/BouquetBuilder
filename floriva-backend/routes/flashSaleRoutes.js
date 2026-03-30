const express = require("express");
const router = express.Router();
const { getFlashSales, reduceStock, resetSales } = require("../controllers/flashSaleController");

router.get("/", getFlashSales);
router.patch("/:id/reduce", reduceStock);
router.post("/reset", resetSales);

module.exports = router;
