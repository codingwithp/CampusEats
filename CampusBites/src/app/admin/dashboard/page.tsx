"use client"
import axios from 'axios'
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, Users, Package, DollarSign, Plus, Edit, Trash2 } from "lucide-react"
import Link from 'next/link';
interface Canteen {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  Timings: string;
  location: string;
  specialties: string[];
  isOpen: boolean;
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  canteen: string;
  available: boolean;
}


const salesData = [
  { name: "Mon", orders: 45, revenue: 12500 },
  { name: "Tue", orders: 52, revenue: 14200 },
  { name: "Wed", orders: 38, revenue: 10800 },
  { name: "Thu", orders: 61, revenue: 16900 },
  { name: "Fri", orders: 73, revenue: 19500 },
  { name: "Sat", orders: 89, revenue: 23400 },
  { name: "Sun", orders: 67, revenue: 18200 },
]

const canteenData = [
  { name: "Law Canteen", value: 42, color: "#FF6B35" },
  { name: "Vidhyarthi Khana", value: 40, color: "#F7931E" },
  { name: "Sip & Snack", value: 18, color: "#FFD23F" },
]

 

export default function AdminDashboard() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
 

  useEffect(() => {
    const fetchCanteens = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/CanteenName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
  setCanteens(data);
} else {
  console.error("Expected canteen array but got:", data);
  setCanteens([]);
}

  } catch (err) {
    console.error("Failed to fetch canteens:", err);
    setCanteens([]);
  }
};

     const fetchMenuItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/MenuItem');
      if (!res.ok) {
        console.error(`Fetch failed with status ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("Fetched Menu:", data);
      setMenuItems(data.menuItems); // ✅ Make sure this is an array
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };


    // Fix: Ensure it's an array before setting
    


    fetchCanteens();
    fetchMenuItems();
  }, []);


   

  const [activeTab, setActiveTab] = useState("overview")
  const [items, setItems] = useState<MenuItem[]>([]);

// Sync fetched menuItems to items when menuItems is updated
useEffect(() => {
  setItems(menuItems);
}, [menuItems]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    category: "",
    canteen: "",
    description: "",
  })

  const addMenuItem = async () => {
  if (newItem.name && newItem.price && newItem.category && newItem.canteen) {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/MenuItem", {
        name: newItem.name,
        price: Number(newItem.price),
        category: newItem.category,
        canteen: newItem.canteen,
        available: true
      });

      // Add the newly saved item from DB to local state
      setItems([...items, response.data]);

      // Reset form
      setNewItem({ name: "", price: 0, category: "", canteen: "", description: "" });
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }
};


  // const toggleAvailability = (id: string) => {
  //   setItems(items.map((item) => (item._id === id ? { ...item, available: !item.available } : item)))
  // }
  const toggleAvailability = async (id: string) => {
  setItems(prevItems =>
    prevItems.map(item =>
      item._id === id ? { ...item, available: !Boolean(item.available) } : item
    )
  );

  try {
   const targetItem = items.find(item => item._id === id);
if (!targetItem) return;

const newAvailable = !targetItem.available;

const res = await axios.patch(
  `http://localhost:5000/api/auth/MenuItem/${id}/toggle-availability`,
  { available: newAvailable } // ✅ This must be a boolean
);

    if (res.status !== 200) {
      throw new Error(`Failed to update availability: ${res.statusText}`);
    }

  } catch (error) {
    console.error("Error updating availability:", error);
    setItems(prevItems =>
      prevItems.map(item =>
        item._id === id ? { ...item, available: Boolean(items.find(i => i._id === id)?.available) } : item
      )
    );
  }
};


const deleteItem = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/auth/MenuItem/${id}`);

    if (response.status === 200) {
      setItems(prevItems => prevItems.filter(item => item._id !== id));
    } else {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">CampusBites Management Portal</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Administrator</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="canteens">Canteens</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">₹1,15,500</p>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">425</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">₹271</p>
                      <p className="text-sm text-gray-600">Avg Order Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Sales</CardTitle>
                  <CardDescription>Orders and revenue for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#FF6B35" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Canteen Performance</CardTitle>
                  <CardDescription>Order distribution by canteen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={canteenData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {canteenData.map((entry, index) => (
                          <Cell key={`cell-${index
              
                          }`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="canteens" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canteen Management</CardTitle>
                <CardDescription>Manage canteen information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {canteenData.map((canteen, index) => (
                    <Card key={canteen.name}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{canteen.name}</h3>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{canteen.value}% of total orders</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          


  <Button size="sm" variant="default">View Menu</Button>

                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            {/* Add New Item */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Menu Item</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemPrice">Price (₹)</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem,  price: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Course">Main Course</SelectItem>
                        <SelectItem value="Snacks">Snacks</SelectItem>
                        <SelectItem value="Beverages">Beverages</SelectItem>
                        <SelectItem value="Desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="itemCanteen">Canteen</Label>
                    <Select
                      value={newItem.canteen}
                      onValueChange={(value) => setNewItem({ ...newItem, canteen: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select canteen" />
                      </SelectTrigger>
                      <SelectContent>
  {canteens.map((canteen) => (
    <SelectItem key={canteen._id} value={canteen.name}>
      {canteen.name}
    </SelectItem>
  ))}
</SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addMenuItem} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Items List */}
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>Manage existing menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.category} • {item.canteen} • ₹{item.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.available ? "default" : "secondary"}>
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => toggleAvailability(item._id)}>
                          Toggle
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteItem(item._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#118AB2" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Fried Rice", orders: 89, revenue: "₹16,020" },
                      { name: "Masala Dosa", orders: 76, revenue: "₹6,080" },
                      { name: "Idli Vada", orders: 65, revenue: "₹14,300" },
                      { name: "Samosa", orders: 54, revenue: "₹8,640" },
                    ].map((item) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.orders} orders</p>
                        </div>
                        <p className="font-semibold">{item.revenue}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}  