"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/CartStore";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage({ product }) {
  const { addToCart, cart, removeFromCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const handleAddtoCart = async (event) => {
    event.stopPropagation();
    await addToCart(product);
    setQuantity(cart.find((p) => p.id === id)?.quantity ?? 1);
  };

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
            src={
              product?.imageLinks?.at(0) ||
              "https://res.cloudinary.com/dvjxfsqqx/image/upload/v1743965678/grocery_qcnkqu.png"
            }
            alt={product?.name || "Product Image"}
            className="object-cover rounded-lg"
            width={400}
            height={400}
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
          <p className="text-2xl font-bold text-primary mb-4">
            ₹{product?.price}
          </p>
          <p className="text-muted-foreground mb-6">{product?.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <p className="font-medium">Quantity:</p>
            <div className="flex items-center border rounded-md">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => removeFromCart(product.id)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => addToCart(product)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleAddtoCart}
              className="flex-1 bg-green-500 hover:bg-green-700 text-black"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
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
                  product?.stock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product?.stock > 10
                  ? "In Stock"
                  : `Only ${product?.stock} left`}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="font-semibold text-lg mb-2">Product Details</h2>
              <ul className="space-y-2">
                <li>
                  <span className="font-medium">Category:</span>{" "}
                  {product?.category}
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
                    {product?.nutrition
                      ? Object.entries(product.nutrition).map(
                          ([key, value]) => (
                            <li key={key} className="flex justify-between">
                              <span className="capitalize">{key}</span>
                              <span className="font-medium">{value}</span>
                            </li>
                          ),
                        )
                      : "No nutrition information available"}
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
