'use client'
import React , {useEffect, useState} from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

function Featured_products() {
  const product = [
    {
      id: "67d833695eb9cc426f3cd9b6",
      name: "Banana",
      price: 35,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id: "67d833695eb9cc426f3cd9ba",
      name: "Coca Cola",
      price: 95,
      rating: 1,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:"67d833695eb9cc426f3cd9bb",
      name: "Lays",
      price: 50,
      rating: 3,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:"67d833695eb9cc426f3cd9b7",
      name: "Apple",
      price: 140,
      rating: 6,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      id:"67d833695eb9cc426f3cd9b5",
      name: "Burbone",
      price: 70,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
  ];

  const router = useRouter();


  const [productList , setProductList]  = useState([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.post("http://localhost:3000/public/get-products-range",{
          startIndex:0,
          endIndex:5
      });
        setProductList(res.data.data.products);
        console.log(res.data.data.products); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts()
  }, [])
  


  return (
    <div className="flex flex-col p-4 mt-4">
      <div className="flex  flex-row justify-between">
        <div className="text-3xl mb-4 font-bold">Featured Products</div>
        <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
          <Button className='w-full' onClick={() => router.push("/allproduct")}>See all →</Button>
        </div>
      </div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-8xl items-center">
        {productList.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name= {product.name}
            brand={product.brand}
            rating ={product.rating}
            price ={product.price}
          />
        ))}
      </div>
    </div>
  );
}

export default Featured_products;
