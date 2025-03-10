'use client'

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react"

function ProductCard({image , name , rating , price}){
  return (
    <Card className="w-66 h-[28rem]  overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 pt-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform pt-0 "
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-0 pt-0  ">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "fill-orange-400"
                      : "fill-muted text-muted-foreground"
                  }`}
                  
                />
              ))}
            <span className="text-sm text-muted-foreground">
              ({rating}/5)
            </span>
          </div>
          <p className="font-bold text-xl">₹{price.toFixed(2)}</p>
        </div>
        <div className="mt-4 bg-green-500 rounded-2xl hover:bg-green-700 ">
        <Button className="w-full">Add to Cart</Button>
        </div>

      </CardContent>
      {/* <CardFooter className="p-6 pt-0">
        <Button className="w-full">Add to Cart</Button>
      </CardFooter> */}
    </Card>
  );
}

export default ProductCard;
