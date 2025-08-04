"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Package, CheckCircle, AlertCircle } from "lucide-react"

interface Order {
  id: string
  customerName: string
  items: { name: string; quantity: number; customization?: string }[]
  total: number
  status: "new" | "preparing" | "ready" | "completed"
  orderTime: string
  estimatedTime: string
  specialInstructions?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD123456",
    customerName: "Rashmitha",
    items: [
      { name: "Fried Rice", quantity: 2, customization: "Medium spicy" },
      { name: "Maggie", quantity: 3 },
    ],
    total: 420,
    status: "new",
    orderTime: "2:45 PM",
    estimatedTime: "15-20 min",
    specialInstructions: "Extra gravy please",
  },
  {
    id: "ORD123457",
    customerName: "Preeti",
    items: [
      { name: "Masala Dosa", quantity: 2 },
      { name: "Watermelon juice", quantity: 1 },
    ],
    total: 190,
    status: "preparing",
    orderTime: "2:30 PM",
    estimatedTime: "10-15 min",
  },
  {
    id: "ORD123458",
    customerName: "Pragathi",
    items: [
      { name: "Vada", quantity: 1 },
      { name: "Samosa", quantity: 1 },
    ],
    total: 250,
    status: "ready",
    orderTime: "2:15 PM",
    estimatedTime: "20-25 min",
  },
]

export default function StaffDashboard() {
  const [orders, setOrders] = useState(mockOrders)
  const [selectedStatus, setSelectedStatus] = useState("all")

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500"
      case "preparing":
        return "bg-yellow-500"
      case "ready":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      default:
        return "bg-gray-300"
    }
  }

  const filteredOrders = selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  const stats = {
    totalOrders: orders.length,
    newOrders: orders.filter((o) => o.status === "new").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold">Staff Dashboard</h1>
              
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Online</Badge>
              <Button variant="outline">Settings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.newOrders}</p>
                  <p className="text-sm text-gray-600">New Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.preparing}</p>
                  <p className="text-sm text-gray-600">Preparing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.ready}</p>
                  <p className="text-sm text-gray-600">Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order Management</CardTitle>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="new">New Orders</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {order.customerName} • {order.orderTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">₹{order.total}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.name} x {item.quantity}
                              {item.customization && (
                                <span className="text-orange-600 ml-2">({item.customization})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.specialInstructions && (
                      <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm">
                          <strong>Special Instructions:</strong> {order.specialInstructions}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Est. {order.estimatedTime}</span>
                      </div>
                      <div className="flex space-x-2">
                        {order.status === "new" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, "ready")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")} variant="outline">
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}  