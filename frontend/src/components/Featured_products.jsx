'use client'
import React , {useState} from "react";
import ProductCard from "./ProductCard";
// import "@/components/Featured_products.css"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Featured_products() {

  const [cart , setCart] = useState([]);

  const product = [
    {
      name: "Banana",
      price: 35,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      name: "Coca Cola",
      price: 95,
      rating: 1,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      name: "Lays",
      price: 50,
      rating: 3,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      name: "Apple",
      price: 140,
      rating: 6,
      image: "/images/Backery_biscuit.jpg",
    },
    {
      name: "Burbone",
      price: 70,
      rating: 4,
      image: "/images/Backery_biscuit.jpg",
    },
  ];

  const addToCart = (product)=>
  {
    setCart((prevCart)=> [...prevCart , product]);
  }

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
        {product.map((category, index) => (
          <ProductCard
            key={index}
            image={category.image}
            name={category.name}
            rating={category.rating}
            price={category.price}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
}

export default Featured_products;
