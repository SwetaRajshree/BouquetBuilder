const express = require("express");
const router = express.Router();
const { addFlower, getAllFlowers, getMyFlowers, getFlowersByShop, getFlowersByCity } = require("../controllers/flowerController");
const { protect, retailerOnly } = require("../middleware/authMiddleware");

router.get("/", getAllFlowers);
router.get("/city/:city", getFlowersByCity);
router.post("/add", protect, retailerOnly, addFlower);
router.get("/my-flowers", protect, retailerOnly, getMyFlowers);
router.get("/shop/:shopId", getFlowersByShop);

module.exports = router;
