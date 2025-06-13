const express = require("express");
const { register, login } = require("../controllers/authController");

const MenuItem = require("../models/MenuItem");
const router = express.Router();

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


// Add a menu item
router.post('/MenuItem', async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});
router.patch('/MenuItem/:id/toggle-availability', async (req, res) => {
  const id = req.params.id;
  const { available } = req.body;

  // Find item by id and update availability
  const updatedItem = await MenuItem.findByIdAndUpdate(id, { available }, { new: true });

  if (!updatedItem) {
    return res.status(404).send({ error: 'Item not found' });
  }

  res.send(updatedItem);
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




router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    console.log("1231242343242354",req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
            console.log("1231242343242354",req.body.email)
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})
router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});


module.exports = router