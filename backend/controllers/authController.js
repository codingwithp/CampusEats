// 


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Predefined accounts (hardcoded)
const PREDEFINED_ACCOUNTS = {
  admin: {
    email: "admin@bmsce.ac.in",
    password: "Admin123",
    role: "admin",
  },
  staff: {
    email: "staff@bmsce.ac.in",
    password: "Staff123",
    role: "staff",
  },
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || `${user.role}-id`, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, phone, studentId } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
      studentId,
      role: "student",
    });

    const token = generateToken(user);
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check predefined admin
    if (
      email === PREDEFINED_ACCOUNTS.admin.email &&
      password === PREDEFINED_ACCOUNTS.admin.password
    ) {
      const adminUser = {
        _id: "admin-id",
        role: PREDEFINED_ACCOUNTS.admin.role,
        email: PREDEFINED_ACCOUNTS.admin.email,
      };
      const token = generateToken(adminUser);
      return res.json({ token, role: adminUser.role });
    }

    // Check predefined staff
    if (
      email === PREDEFINED_ACCOUNTS.staff.email &&
      password === PREDEFINED_ACCOUNTS.staff.password
    ) {
      const staffUser = {
        _id: "staff-id",
        role: PREDEFINED_ACCOUNTS.staff.role,
        email: PREDEFINED_ACCOUNTS.staff.email,
      };
      const token = generateToken(staffUser);
      return res.json({ token, role: staffUser.role });
    }

    // Otherwise, check normal users in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
