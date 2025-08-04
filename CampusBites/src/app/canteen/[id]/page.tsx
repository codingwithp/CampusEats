"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, useDispatchCart } from "@/components/ui/ContextReducer";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ArrowLeft, Clock, Filter, Leaf, Minus, Plus, Search, ShoppingCart, Star } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  canteen: string;
  available: boolean;
  isVeg?: boolean;
  image?: string;
  description?: string;
  customizable?: boolean;
  preparationTime?: string;
  rating?: number;
}

export default function CanteenMenuPage() {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  // const [cart, setCart] = useState<{ [key: string]: number }>({});
  const cart = useCart();
const dispatch = useDispatchCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/MenuItem/${id}`);
        const data = await res.json();
        setMenuItems(data.menuItems);
        setFilteredItems(data.menuItems);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (id) fetchMenuItems();
  }, [id]);

  // Unique categories
  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))];

  useEffect(() => {
    let filtered = menuItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if  (filterType === "available") {
      filtered = filtered.filter((item) => item.available);
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, filterType, menuItems]);

 

const addToCart = (item: MenuItem) => {
  dispatch({
    type: "ADD",
    item: {
      id: item._id,
      name: item.name,
      price: item.price,
      img: item.image,
      qty: 1,
    },
  });
};


const removeFromCart = (itemId: string) => {
  dispatch({ type: "REMOVE", id: itemId });
};

 const getTotalItems = () => {
  return cart.reduce((sum, item) => sum + item.qty, 0);
};

// Total price of all items in cart
const getTotalPrice = () => {
  return cart.reduce((total, item) => total + item.price * item.qty, 0);
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Menu</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative" asChild>
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                
                <SelectItem value="available">Available Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
  <Card
    key={item._id}
    className={`!py-2 !px-3 text-sm shadow-sm border-gray-200 ${
      !item.available ? "opacity-60" : ""
    }`}
  >
    <CardHeader className="pb-1 px-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-base font-medium">{item.name}</CardTitle>
        {item.rating && (
          <div className="flex items-center space-x-1 text-xs text-yellow-600">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.rating}</span>
          </div>
        )}
      </div>
      {item.description && (
        <CardDescription className="text-xs text-muted-foreground">
          {item.description}
        </CardDescription>
      )}
    </CardHeader>

    <CardContent className="pt-1 px-2 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-green-600 font-semibold">₹{item.price}</span>
        {item.preparationTime && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {item.preparationTime}
          </div>
        )}
      </div>

      {item.customizable && (
        <Badge variant="outline" className="text-[10px] py-0.5 px-1.5">
          Customizable
        </Badge>
      )}

      {cart.find((cartItem) => cartItem.id === item._id) ? (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeFromCart(item._id)}
            className="h-7 w-7 text-xs"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium">
            {cart.find((cartItem) => cartItem.id === item._id)?.qty || 0}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => addToCart(item)}
            className="h-7 w-7 text-xs"
            disabled={!item.available}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => addToCart(item)}
          className="h-8 w-20 text-xs"
          disabled={!item.available}
        >
          Add
        </Button>
      )}
    </CardContent>
  </Card>
))}

        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
          </div>
        )}
      </div>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <Card className="bg-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{getTotalItems()} items in cart</p>
                  <p className="text-orange-100">Total: ₹{getTotalPrice()}</p>
                </div>
                <Button variant="secondary" asChild>
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
