require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// ======================
// Routes
// ======================
const authRoutes     = require("./routes/authRoutes");
const flowerRoutes   = require("./routes/flowerRoutes");
const shopRoutes     = require("./routes/shopRoutes");
const orderRoutes    = require("./routes/orderRoutes");
const flashSaleRoutes = require("./routes/flashSaleRoutes");
const adminRoutes    = require("./routes/adminRoutes");
const bouquetShareRoutes = require("./routes/bouquetShareRoutes");
const voiceNoteRoutes    = require("./routes/voiceNoteRoutes");
const fillerRoutes       = require("./routes/fillerRoutes");
const plantRoutes        = require("./routes/plantRoutes");
const reviewRoutes       = require("./routes/reviewRoutes");
const gardenRoutes       = require("./routes/gardenRoutes");

app.use("/api/auth",       authRoutes);
app.use("/api/flowers",    flowerRoutes);
app.use("/api/shops",      shopRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/flashsales", flashSaleRoutes);
app.use("/api/admin",      adminRoutes);
app.use("/api/bouquet",    bouquetShareRoutes);
app.use("/api/voice",      voiceNoteRoutes);
app.use("/api/fillers",    fillerRoutes);
app.use("/api/plants",    plantRoutes);
app.use("/api/reviews",   reviewRoutes);
app.use("/api/gardens",   gardenRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Floriva API is running 🌸");
});

// ======================
// MongoDB Connection
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Floriva Server running on port ${PORT}`);
    });

  })
  .catch(err => {
    console.log("MongoDB Connection Error:", err);
  });