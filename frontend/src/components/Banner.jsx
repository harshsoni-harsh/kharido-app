"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function Banner() {
  const router = useRouter();
  return (
    <>
      <div className="container xl:mx-auto xl:px-20 px-4 mt-12 md:mt-24 flex flex-col md:flex-row md:justify-between items-center">
        <div className="w-full order-2 md:order-1 md:w-1/2">
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
          <Button
            onClick={() => router.push("/products")}
            className="h-10  w-22 rounded-xl bg-green-500 hover:bg-green-700 duration-300 cursor-pointer mt-6 text-white"
          >
            Shop now
          </Button>
        </div>
        <div className="order-1 w-full md:w-1/2 max-h-full">
          <img
            src={
              "https://res.cloudinary.com/dvjxfsqqx/image/upload/v1743965678/grocery_qcnkqu.png"
            }
            width={550}
            height={460}
            className="xl:ml-auto max-md:min-w-full object-contain max-h-96"
            alt="front image"
          />
        </div>
      </div>
    </>
  );
}

export default Banner;
