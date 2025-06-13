const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  studentId: String,
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
