"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import usePublicStore from "@/store/PublicStore";
import Loader from "@/components/Loader";

export default function Page() {
  const { categories, products, loading, fetchCategories, fetchAllProducts } =
    usePublicStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories?.length) {
      fetchAllProducts();
    }
  }, [categories]);

  if (loading) return <Loader />;

  return (
    <div className="lg:mx-16 md:mx-8 sm:mx-4 mt-10 mb-8">
      <div className="flex flex-col gap-6">
        {categories?.map((category, index) => (
          <div
            className="flex flex-col rounded-2xl p-4 gap-4 shadow-xl"
            key={index}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="text-2xl font-bold">{category.name}</div>
              <div className="h-fit text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
                <Button className="w-full cursor-pointer">See all →</Button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:flex 2xl:flex-wrap gap-6 w-full max-w-8xl items-center">
              {products[category._id]?.map((product, index) => (
                <ProductCard
                  key={index}
                  id={product._id}
                  imageLinks={product.imageLinks}
                  name={product.name}
                  rating={product.rating}
                  price={product.price}
                  brand={product.brand}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
