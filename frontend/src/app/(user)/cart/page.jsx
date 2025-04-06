"use client";

import { ShoppingCart } from "lucide-react";
import CartItems from "@/components/cart-items";
import CartSummary from "@/components/cart-summary";

export default function Cart() {
  return (
    <div className="container mx-auto px-4 mt-16 mb-12">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-3xl font-semibold text-green-500">Your Cart</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
