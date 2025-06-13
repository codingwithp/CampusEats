require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// Connect to MongoDB and Start Server After Connection
connectDB((err, data) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }

  global.CanteenName = data;
  console.log("Loaded canteen data:", data.length, "items");

  app.use("/api/auth", authRoutes);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
