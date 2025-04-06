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
import { useRouter } from "next/navigation";

function ProductCard({ id, imageLinks, name, rating, price, brand }) {
  const { addToCart, cart } = useCartStore();
  const [quantity, setQuantity] = useState(null);

  const handleAddtoCart = async (event) => {
    event.stopPropagation();
    const product = {
      id,
      name,
      imageLinks,
      rating,
      price,
      quantity: quantity ?? 1,
    };
    await addToCart(product);
    setQuantity(cart.find((p) => p.id === id)?.quantity ?? 0);
  };
  useEffect(() => {
    setQuantity(cart.find((p) => p.id === id)?.quantity ?? 0);
  }, []);

  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/products/${id}`);
  };

  return (
    <Card onClick={handleCardClick} className="gap-0 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg border-zinc-200 h-full">
      <CardHeader className="p-0">
        <div
          className="relative h-50 w-full max-h-50"
        >
          {imageLinks?.length && (
            <Image
              src={imageLinks[0]}
              alt={name}
              width={300}
              height={300}
              className="object-contain transition-transform pt-0 h-full mx-auto"
              priority
            />
          )}
        </div>
      </CardHeader>
      <CardContent className={"h-full mt-4"}>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2 mt-auto">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    "h-4 w-4",
                    i < rating
                      ? "fill-orange-400"
                      : "fill-muted text-muted-foreground"
                  )}
                />
              ))}
            <span className="text-sm text-muted-foreground">({rating ?? 0}/5)</span>
          </div>
          <div className="flex flex-row justify-between items-center flex-wrap">
            <p className="font-bold text-xl"> ₹{price.toFixed(2)} </p>
            <div className="font-semibold text-sm">
              In cart: {quantity ?? 0}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className={"mt-2"}>
        <Button
          className="w-full bg-green-500 rounded-2xl hover:bg-green-700 mt-full cursor-pointer"
          onClick={handleAddtoCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
