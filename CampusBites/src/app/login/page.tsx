"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Users } from "lucide-react";

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

export default function HomePage() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCanteens() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/CanteenName", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch canteen data");
        }

        const data = await res.json();

        // Defensive check: make sure data is an array
        if (!Array.isArray(data)) {
          throw new Error("Canteen data is not an array");
        }

        setCanteens(data);
      } catch (error) {
        console.error(error);
      }
    }

   fetchCanteens().then(data => console.log(data));

  }, []);

 return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
    {/* Header */}
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-orange-600">🍽️ CampusBites</div>
          <nav className="hidden md:flex space-x-8">
            
          </nav>
          <div>
            
          </div>
        </div>
      </div>
    </header>

    {/* Hero Section */}
    <section className="py-12 px-4 text-center">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Order Food from Your <span className="text-orange-600">Favorite Canteens</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Skip the queues, order online, and get notified when your food is ready for pickup.
        </p>
      </div>
    </section>

    {/* Canteens Grid */}
    <section className="py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Choose Your Canteen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canteens?.length > 0 && canteens.map((canteen) => (
            <Card
              key={canteen._id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                !canteen.isOpen ? "opacity-60" : ""
              } ${selectedCanteen === canteen._id ? "ring-2 ring-orange-500" : ""}`}
              onClick={() => setSelectedCanteen(canteen._id)}
            >
              <div className="relative">
                <Image
                  src={canteen.image || "/placeholder.svg"}
                  alt={canteen.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={canteen.isOpen ? "default" : "secondary"}>
                    {canteen.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{canteen.name}</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{canteen.rating}</span>
                  </div>
                </div>
                <CardDescription>{canteen.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{canteen.Timings}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{canteen.location}</span>
                  </div>
                 
                  <div className="flex flex-wrap gap-1 mt-3">
                    {canteen.specialties.map((specialty, index) => (
                      <Badge key={`${canteen._id}-specialty-${index}`} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full mt-4" disabled={!canteen.isOpen} asChild>
                   <Link href={`/canteen/${encodeURIComponent(canteen.name)}`}>
  {canteen.isOpen ? "View Menu" : "Closed"}
</Link>
{/* <Link href={/canteen/${canteen._id}}>
                      {canteen.isOpen ? "View Menu" : "Closed"}
                    </Link> */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🍽️ CampusEats</h3>
            <p className="text-gray-400">Making campus dining convenient and efficient for everyone.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
           
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Canteens</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/staff/login" className="hover:text-white">Staff Login</Link></li>
              <li><Link href="/admin/login" className="hover:text-white">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CampusEats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);
}