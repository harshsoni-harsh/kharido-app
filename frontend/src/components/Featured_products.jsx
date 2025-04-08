"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

function Featured_products() {
  const router = useRouter();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.post(`/api/public/get-products-range`, {
          startIndex: 0,
          endIndex: 5,
        });
        setProductList(res.data.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col p-4 mt-4">
      <div className="flex  flex-row justify-between">
        <div className="text-3xl mb-4 font-bold">Featured Products</div>
        <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
          <Button className="w-full" onClick={() => router.push("/products")}>
            See all →
          </Button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:flex 2xl:flex-wrap gap-6 w-full max-w-8xl items-center">
        {productList.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            imageLinks={product.imageLinks}
            name={product.name}
            brand={product.brand}
            rating={product.rating}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default Featured_products;
