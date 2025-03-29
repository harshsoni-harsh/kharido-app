"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Sample product data (In real applications, fetch from an API)
const products = [
  {
    id: "1",
    name: "Organic Bananas",
    price: 2,
    image: "/images/Backery_biscuit.jpg",
    category: "Fruits",
    unit: "bunch",
    stock: 25,
    description: "Fresh organic bananas sourced from local farms.",
    nutrition: { calories: 105, protein: "1.3g", carbs: "27g", fat: "0.4g" },
    origin: "Ecuador",
  },
  {
    id: "2",
    name: "Fresh Avocados",
    price: 80,
    image: "/images/Backery_biscuit.jpg",
    category: "Fruits",
    unit: "each",
    stock: 15,
    description: "Creamy, ripe avocados perfect for guacamole.",
    nutrition: { calories: 240, protein: "3g", carbs: "12g", fat: "22g" },
    origin: "Mexico",
  },
];

export default function ProductPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extract product ID from URL

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            className="object-cover rounded-lg"
            width={400}
            height={400}
          />
          <Badge className="absolute top-4 right-4 text-sm">
            {product.category}
          </Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-4">
          ₹{product.price} / {product.unit}
          </p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <p className="font-medium">Quantity:</p>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">1</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button className="flex-1 bg-green-500">
              <ShoppingCart className="mr-2 h-4 w-4 " />
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              Buy Now
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-2">Availability</h2>
              <p
                className={
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold text-lg mb-2">Product Details</h2>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold text-lg mb-2">
                Nutrition Information
              </h2>
              <Card>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
