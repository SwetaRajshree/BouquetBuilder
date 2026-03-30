const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllShops, getMe, updateProfile, changePassword, addAddress, updateAddress, deleteAddress } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login",    loginUser);
router.get("/me",        protect, getMe);
router.put("/profile",   protect, updateProfile);
router.put("/password",  protect, changePassword);
router.post("/addresses",           protect, addAddress);
router.put("/addresses/:addrId",    protect, updateAddress);
router.delete("/addresses/:addrId", protect, deleteAddress);
router.get("/shops",     getAllShops);

module.exports = router;
