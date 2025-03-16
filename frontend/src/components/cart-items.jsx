"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/CartStore";




export default function CartItems(){

  const {cart , addToCart , removeFromCart} = useCartStore();

  // const [cartItems, setCartItems] = useState(initialCartItems);



  // const updateQuantity = (id, newQuantity) => {
  //   if (newQuantity < 1) return;

  //   setCartItems(
  //     cartItems.map((item) =>
  //       item.id === id ? { ...item, quantity: newQuantity} : item
  //     )
  //   ); 
    
  // };

  // const removeItem = (id) => {
  //   setCartItems(cartItems.filter((item) => item.id !== id));
  // };

  

  if (cart.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground mt-2">
              Add some items to your cart to see them here.
            </p>
            <Button className="mt-4" asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
    <CardContent className="pt-6">
      <div className="space-y-5">
        {cart.map((item , index) => (
          <div key={item.i0 ?? index}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  );
}


