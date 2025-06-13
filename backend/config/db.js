const mongoose = require("mongoose");

const connectDB = async (callback) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");

    const db = mongoose.connection.db;
    const Canteens = db.collection("CanteenName");

    const data = await Canteens.find({}).toArray();
    console.log("Fetched canteen data count:", data.length);

    callback(null, data);

  } catch (err) {
    console.error("MongoDB connection error:", err);
    callback(err, null);
  }
};

module.exports = connectDB;
