const express = require("express");
const router = express.Router();
const { getAllPlants, seedPlants } = require("../controllers/plantController");

router.get("/", getAllPlants);          // GET /api/plants?category=Succulents
router.get("/seed", seedPlants);        // GET /api/plants/seed  (run once in browser)

module.exports = router;
