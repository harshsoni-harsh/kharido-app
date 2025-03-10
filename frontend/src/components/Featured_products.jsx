import React from "react";
import ProductCard from "./ProductCard";
import "@/components/Featured_products.css"

function Featured_products() {
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

  return (
    <>
      <div className="flex flex-col p-4 mt-4 ml-16 ">
        <div className="text-3xl mb-4 font-bold">Featured Products</div>
        <div className="list grid  gap-6 w-full max-w-8xl items-center" >
          {product.map((category, index) => (
            <ProductCard
              key={index}
              image={category.image}
              name={category.name}
              rating={category.rating}
              price={category.price}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Featured_products;
