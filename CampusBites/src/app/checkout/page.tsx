"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";

import { useCart, useDispatchCart } from "@/components/ui/ContextReducer";

export default function Checkout() {
  const cart = useCart();
  const dispatch = useDispatchCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = Math.floor(subtotal * 0.1);
  const total = subtotal - discount;

  // Form states
  const [firstName, setFirstName] = useState("Pragathi");
  const [lastName, setLastName] = useState("Acharya");
  const [phone, setPhone] = useState("+91 9611918068");
  const [email, setEmail] = useState("pragathi.is22@bmsce.ac.in");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "wallet">("upi");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  // Order states
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePayment = () => {
    if (!firstName || !lastName || !phone || !email) {
      alert("Please fill in all contact details.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !expiry || !cvv) {
        alert("Please fill in all card details.");
        return;
      }
    } else if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const fakeOrderId = "ORD" + Math.floor(Math.random() * 1000000);
      setOrderId(fakeOrderId);
      setOrderPlaced(true);
      setIsProcessing(false);
      dispatch({ type: "CLEAR" }); // Clear cart after order
    }, 2000);
  };

  if (orderPlaced && orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed and is being prepared.
            </p>
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
              <p className="text-2xl font-bold text-orange-600">{orderId}</p>
              <p className="text-xs text-gray-500 mt-1">
                Show this ID when collecting your order
              </p>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Central Canteen - Ground Floor</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Estimated time: 15-20 minutes</span>
              </div>
            </div>
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/orders/${orderId}`}>Track Order</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Order More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold ml-4">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Pickup */}
            

            {/* Contact Info */}
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <Smartphone className="h-5 w-5" /><span>UPI</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg mb-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <CreditCard className="h-5 w-5" /><span>Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center space-x-2 flex-1 cursor-pointer">
                      <Wallet className="h-5 w-5" /><span>College Wallet</span>
                      <Badge variant="outline" className="ml-auto">Balance: ₹1250</Badge>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
y
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="mt-4">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input id="upiId" placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span><span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount (10%)</span><span>-₹{discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span><span className="text-green-600">Free Pickup</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-sm text-gray-600 space-y-2">
                <p>• You will receive an order ID after payment</p>
                <p>• Show the order ID when collecting your food</p>
                <p>• You'll get notifications about order status</p>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? "Processing Payment..." : `Pay ₹${total}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
