const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  adminGetFlowers, adminAddFlower, adminUpdateFlower, adminDeleteFlower,
  adminGetShops,   adminAddShop,   adminUpdateShop,   adminDeleteShop,
  adminGetOrders,  adminUpdateOrderStatus,
  adminGetUsers,
} = require("../controllers/adminController");

router.use(protect, adminOnly);

// Flowers
router.get("/flowers",          adminGetFlowers);
router.post("/flowers",         adminAddFlower);
router.put("/flowers/:id",      adminUpdateFlower);
router.delete("/flowers/:id",   adminDeleteFlower);

// Shops
router.get("/shops",            adminGetShops);
router.post("/shops",           adminAddShop);
router.put("/shops/:id",        adminUpdateShop);
router.delete("/shops/:id",     adminDeleteShop);

// Orders
router.get("/orders",           adminGetOrders);
router.put("/orders/:id/status",adminUpdateOrderStatus);

// Users
router.get("/users",            adminGetUsers);

module.exports = router;
