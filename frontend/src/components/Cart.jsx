"use client";

import CartItems from "@/components/cart-items";
import CartSummary from "@/components/cart-summary";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

function Cart() {
  const [cart, setCart] = useState([]);

  const initialCartItems = [
    {
      id: 1,
      name: "Organic Bananas",
      price: 45,
      quantity: 1,
      image: "/images/banana.jpg",
      category: "Fruits",
    },
    {
      id: 2,
      name: "Apple",
      price: 120,
      quantity: 1,
      image: "/images/banana.jpg",
      category: "Fruits",
    },
    {
      id: 3,
      name: "Coldrinks",
      price: 60,
      quantity: 1,
      image: "/images/banana.jpg",
      category: "Cold Drinks",
    },
    {
      id: 4,
      name: "Biscuit",
      price: 20,
      quantity: 1,
      image: "/images/banana.jpg",
      category: "Bakery and Biscuit",
    },
  ];

  const addToCart = (product) => {
    setCart((prevItms) => [...prevItms, product]);
  };

  return (
    <div className="container mx-auto px-4 mt-20 mb-auto">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-3xl font-semibold text-green-500">Your Cart</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CartItems initialCartItems={initialCartItems} />
        </div>
        <div>
          <CartSummary initialCartItems={initialCartItems} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
