"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  Package,
  ChefHat
} from "lucide-react"

interface OrderStatus {
  status: "confirmed" | "preparing" | "ready" | "completed"
  timestamp: string
}

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id
  const [currentStatus, setCurrentStatus] = useState<OrderStatus["status"]>("confirmed")
  const [progress, setProgress] = useState(25)

  


  const statusSteps = [
    {
      status: "confirmed",
      label: "Order Confirmed",
      icon: CheckCircle,
      description: "Your order has been received"
    },
    {
      status: "preparing",
      label: "Preparing",
      icon: ChefHat,
      description: "Chef is preparing your food"
    },
    {
      status: "ready",
      label: "Ready for Pickup",
      icon: Package,
      description: "Your order is ready"
    },
    {
      status: "completed",
      label: "Completed",
      icon: Star,
      description: "Order completed"
    }
  ]

  // Simulate order status updates
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStatus("preparing")
      setProgress(50)
    }, 5000)

    const timer2 = setTimeout(() => {
      setCurrentStatus("ready")
      setProgress(75)
    }, 15000)

    const timer3 = setTimeout(() => {
      setCurrentStatus("completed")
      setProgress(100)
    }, 25000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500"
      case "preparing":
        return "bg-yellow-500"
      case "ready":
        return "bg-green-500"
      case "completed":
        return "bg-purple-500"
      default:
        return "bg-gray-300"
    }
  }

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.status === currentStatus)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="ml-4">
              <h1 className="text-xl font-semibold">Order #{orderId}</h1>
              <p className="text-sm text-gray-500">Track your order status</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Status</CardTitle>
                  <Badge className={getStatusColor(currentStatus)}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{statusSteps[getCurrentStepIndex()]?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                      const isCompleted = getCurrentStepIndex() >= index
                      const isCurrent = getCurrentStepIndex() === index
                      const Icon = step.icon

                      return (
                        <div key={step.status} className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isCompleted ? getStatusColor(step.status) : "bg-gray-200"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isCompleted ? "text-white" : "text-gray-400"}`} />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isCurrent
                                  ? "text-orange-600"
                                  : isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-sm text-gray-500">{step.description}</p>
                          </div>
                          {isCurrent && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Current
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pickup Information */}
            
            {/* Order Items */}
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-bold text-lg">#{orderId}</p>
                </div>
                
               
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Canteen
                </Button>
                <Button variant="outline" className="w-full">
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full">
                  Cancel Order
                </Button>
              </CardContent>
            </Card>

            {currentStatus === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rate Your Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400 cursor-pointer" />
                    ))}
                  </div>
                  <Button className="w-full">Submit Rating</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
