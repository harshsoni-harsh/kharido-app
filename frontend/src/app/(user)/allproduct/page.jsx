import React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
// import { useRouter } from "next/navigation";

function page() {
  // const router = useRouter()
  const product = [
    {
      name: "Banana",
      price: 35,
      rating: 4,
      image: "/images/Fruits_vegetable.jpg",
      category1: "Fruits and vegetables",
      quantity: 12,
    },
    {
      name: "Apple",
      price: 95,
      rating: 4,
      image: "/images/Fruits_vegetable.jpg",
      category1: "Fruits and vegetables",
      quantity: 6,
    },
    {
      name: "Avacodo",
      price: 250,
      rating: 4.5,
      image: "/images/Fruits_vegetable.jpg",
      category1: "Fruits and vegetables",
      quantity: 3,
    },
    {
      name: "Graphs",
      price: 80,
      rating: 3.5,
      image: "/images/Fruits_vegetable.jpg",
      category1: "Fruits and vegetables",
      quantity: 1,
    },
    {
      name: "Turkish Apple",
      price: 420,
      rating: 4,
      image: "/images/Fruits_vegetable.jpg",
      category1: "Fruits and vegetables",
      quantity: 4,
    },
  ];
  return (
    <div className="lg:mx-16 md:mx-8 sm:mx-4  mt-20 mb-8">
      <div className="">
      <div className="flex flex-col gap-6">
        <div
          className="flex flex-col rounded-2xl px-2 py-2 shadow-2xl"
        >
          <div className="flex  flex-row justify-between">
            <div className="text-2xl mb-4 font-bold mt-4">
              Fruits and Vegetables
            </div>
            <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
              <Button className="w-full">See all →</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
            {product.map((category, index) => (
              <ProductCard
                key={index}
                image={category.image}
                name={category.name}
                rating={category.rating}
                price={category.price}
                quantity={category.quantity}
              />
            ))}
          </div>
        </div>
        <div
          className="flex flex-col rounded-2xl px-2 py-2 shadow-2xl"
        >
          <div className="flex  flex-row justify-between">
            <div className="text-2xl mb-4 font-bold mt-4">
              Fruits and Vegetables
            </div>
            <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
              <Button className="w-full">See all →</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
            {product.map((category, index) => (
              <ProductCard
                key={index}
                image={category.image}
                name={category.name}
                rating={category.rating}
                price={category.price}
                quantity={category.quantity}
              />
            ))}
          </div>
        </div>
        <div
          className="flex flex-col rounded-2xl px-2 py-2 shadow-2xl"
        >
          <div className="flex  flex-row justify-between">
            <div className="text-2xl mb-4 font-bold mt-4">
              Fruits and Vegetables
            </div>
            <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
              <Button className="w-full">See all →</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
            {product.map((category, index) => (
              <ProductCard
                key={index}
                image={category.image}
                name={category.name}
                rating={category.rating}
                price={category.price}
                quantity={category.quantity}
              />
            ))}
          </div>
        </div>
        <div
          className="flex flex-col rounded-2xl px-2 py-2 shadow-2xl"
        >
          <div className="flex  flex-row justify-between">
            <div className="text-2xl mb-4 font-bold mt-4">
              Fruits and Vegetables
            </div>
            <div className=" m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
              <Button className="w-full">See all →</Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
            {product.map((category, index) => (
              <ProductCard
                key={index}
                image={category.image}
                name={category.name}
                rating={category.rating}
                price={category.price}
                quantity={category.quantity}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default page;
