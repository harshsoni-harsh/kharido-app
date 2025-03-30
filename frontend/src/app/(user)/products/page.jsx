"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import axios from "axios";
import usePublicStore from "@/store/PublicStore";

export default function Page() {
  const { categories, products, fetchCategories, fetchAllProducts } = usePublicStore();

  useEffect(() => {
    fetchCategories();
  }, []);
  
  useEffect(() => {
    if (categories?.length) {
      fetchAllProducts();
    }
  }, [categories]);

  return (
    <div className="lg:mx-16 md:mx-8 sm:mx-4  mt-20 mb-8">
      <div className="">
        <div className="flex flex-col gap-6">
          {categories?.map((category, index) => (
            <div
              className="flex flex-col rounded-2xl px-2 py-2 shadow-2xl"
              key={index}
            >
              <div className="flex  flex-row justify-between">
                <div className="text-2xl mb-4 font-bold mt-4">
                  {category.name}
                </div>
                <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
                  <Button className="w-full">See all →</Button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
                {products[category._id]?.products?.map((product, index) => (
                  <ProductCard
                    key={index}
                    image={product.image}
                    name={product.name}
                    rating={product.rating}
                    price={product.price}
                    quantity={product.quantity}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
