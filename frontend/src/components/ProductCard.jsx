"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import useCartStore from "../store/CartStore.js";
import clsx from "clsx";
import { useRouter } from "next/navigation"

function ProductCard({ id, image, name, rating, price }) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [quantity, setQuantity] = useState(null);
  
  const handleAddtoCart = (event) => {
    // debugger;
    event.stopPropagation();
    const product = {
      id,
      name,
      image,
      rating,
      price,
      quantity: quantity ?? 1,
    };
    addToCart(product);
    setQuantity(useCartStore.getState().cart.find((p) => p.id === id)?.quantity ?? 0);
  };
  useEffect(() => {
    setQuantity(useCartStore.getState().cart.find((p) => p.id === id)?.quantity ?? 0);
  }, [])


  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/aboutproduct?id=${id}&image=${image}&name=${name}&rating=${rating}&price=${price}`);
  };



  return (
    <Card
      className="pb-4 overflow-hidden transition-transform duration-300 ease-in-out 
                 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="p-0 pt-0 " >
        <div className="relative h-50 w-full overflow-hidden" onClick = {handleCardClick}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform pt-0"
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-0 pt-0">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={clsx('h-4 w-4',
                    i < rating
                      ? "fill-orange-400"
                      : "fill-muted text-muted-foreground"
                  )}
                />
              ))}
            <span className="text-sm text-muted-foreground">({rating}/5)</span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-xl"> ₹{price.toFixed(2)} </p>
            <div className="font-semibold text-sm"> In cart: {quantity ?? 0} </div>
          </div>
        </div>
        <div className="mt-4 bg-green-500 rounded-2xl hover:bg-green-700 ">
          <Button className="w-full" onClick={handleAddtoCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
