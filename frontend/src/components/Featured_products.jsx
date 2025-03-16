'use client'
import React , {useState} from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Featured_products() {
  const product = [
    {
      id: 1,
      name: "Banana",
      price: 35,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id: 2,
      name: "Coca Cola",
      price: 95,
      rating: 1,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:3,
      name: "Lays",
      price: 50,
      rating: 3,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:4,
      name: "Apple",
      price: 140,
      rating: 6,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:5,
      name: "Burbone",
      price: 70,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
  ];

  const router = useRouter();

  return (
    <div className="flex flex-col p-4 mt-4">
      <div className="flex  flex-row justify-between">
        <div className="text-3xl mb-4 font-bold">Featured Products</div>
        <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
          <Button className='w-full' onClick={() => router.push("/allproduct")}>See all →</Button>
        </div>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-8xl items-center">
        {product.map((category) => (
          <ProductCard
            key={category.id}
            {...category}
          />
        ))}
      </div>
    </div>
  );
}

export default Featured_products;
