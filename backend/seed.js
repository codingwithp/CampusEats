const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model"); // Adjust path accordingly

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: "admin@bmsce.ac.in" });
    if (!existingAdmin) {
      const adminUser = new User({
        name: "Admin User",
        email: "admin@bmsce.ac.in",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      });
      await adminUser.save();
      console.log("Admin user created");
    }

    const existingStaff = await User.findOne({ email: "staff@bmsce.ac.in" });
    if (!existingStaff) {
      const staffUser = new User({
        name: "Staff User",
        email: "staff@bmsce.ac.in",
        password: await bcrypt.hash("staff123", 10),
        role: "staff",
      });
      await staffUser.save();
      console.log("Staff user created");
    }

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

seedUsers();
