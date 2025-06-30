const express = require("express");
const { register, login } = require("../controllers/authController");
const mongoose = require("mongoose");

const MenuItem = require("../models/MenuItem");
const router = express.Router();
const Order = require("../models/Order");

router.post("/register", register);
router.post("/login", login);
router.post('/CanteenName', async (req, res) => {
  try {
    if (!global.CanteenName) {
      console.warn("Canteen data not loaded!");
      return res.status(500).send({ error: "Canteen data not loaded" });
    }

    res.send(global.CanteenName);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// Add this to your backend (e.g., in the same file as your POST route)

router.get('/MenuItem', async (req, res) => {
  try {
    const menuItems = await MenuItem.find(); // fetch all items from MongoDB
    res.json({ menuItems }); // must wrap in an object with "menuItems" key
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});
// Example Express route
router.get('/MenuItem/:canteenName', async (req, res) => {
  const canteenName = req.params.canteenName;

  try {
    const menuItems = await MenuItem.find({ canteen: canteenName });

    if (!menuItems.length) {
      return res.status(404).json({ msg: "No menu items found" });
    }

    res.json({ menuItems });
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
// routes/MenuItem.js
router.post("/MenuItemsByIds", async (req, res) => {
  try {
    const { ids } = req.body;
    const items = await MenuItem.find({ _id: { $in: ids } });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
// router.push(`/checkout?name=${encodeURIComponent(canteen.name)}&location=${encodeURIComponent(canteen.location)}`);



// Add a menu item
router.post('/MenuItem', async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // 👈 Add this line

    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();

    console.log("Saved item:", savedItem); // 👈 Add this line

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Add MenuItem error:", err); // 👈 Show error
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

router.patch('/MenuItem/:id/toggle-availability', async (req, res) => {
  try {
    const id = req.params.id;
    const { available } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error("Toggle availability error:", err.message, err.stack); // ✅ This line is important
    res.status(500).json({ error: 'Server error' });
  }
});







// Delete a menu item by ID
// routes/items.js
router.delete('/MenuItem/:id', async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send('Item not found');
    res.status(200).send('Item deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting item');
  }
});




router.get("/order", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT to update order status
router.put("/order", async (req, res) => {
  const { id, status } = req.body;
  try {
    const updated = await Order.findOneAndUpdate({ _id: id }, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update order" });
  }
});
module.exports = router