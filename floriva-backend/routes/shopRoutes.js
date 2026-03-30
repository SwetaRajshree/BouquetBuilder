const express = require("express");
const router = express.Router();
const { getAllShops, getShopById } = require("../controllers/shopController");

router.get("/", getAllShops);
router.get("/:id", getShopById);

module.exports = router;
