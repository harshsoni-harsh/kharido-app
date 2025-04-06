"use client";
import React from "react";

function Banner() {
  return (
    <>
      <div className="max-w-screen container mx-auto md:px-20 px-4 flex flex-col md:flex-row dark:bg-slate-900 dark:text-white">
        <div className="w-full order-2 md:order-1 md:w-1/2  mt-12 md:mt-48">
          <div className="space-y-2">
            <p className="text-green-500 font-semi-bold">FRESH & ORGANIC</p>
            <h1 className="text-4xl font-bold text-black ">
              Fresh Groceries Delivered to Your Doorstep
            </h1>
            <p className="text-xl text-black">
              Shop from our wide selection of fresh, organic produce and
              groceries. Free delivery on your first order!
            </p>
          </div>
          <button className="h-10  w-22 rounded-xl bg-green-500 hover:bg-green-300 duration-300 cursor-pointer mt-6 text-black">
            Shop now
          </button>
        </div>
        <div className="order-1 w-full md:w-1/2 mt-32">
          <img
            src={"/images/grocery.jpg"}
            // image
            className="md:w-[550px] md:h-[460px] md:ml-12 w-6"
            alt="front image"
          />
        </div>
      </div>
    </>
  );
}

export default Banner;
