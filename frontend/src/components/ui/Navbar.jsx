import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 shadow-md h-16 bg-white px-4 md:px-6">
        <div className=" text-black   flex flex-row  gap-4 md:gap-8 mt-3 justify-between">
          <div className="flex flex-row  gap-6 md:gap-10">
            <div className="px-4  text-3xl font-semibold">
              <span className="text-green-500">{`Khareedo`}</span>
            </div>
            <div>
              <div className="hidden lg:flex  items-center">
                <ul className="flex flex-row gap-6 mt-2 ">
                  <li>
                    <Link href={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link href={"/allproduct"}>Shope</Link>
                  </li>
                  <li>
                    <Link href={"/"}>About us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 md:gap-6">
            <input
              type="text"
              placeholder="Search"
              className="h-10 w-[24rem] md:w-[30rem] px-4 border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-gray-300 bg-white shadow-sm"
            />

            <div className="flex items-center gap-4">
              {/* Profile Link */}
              <div className="flex flex-col">
                <Link href="/profile" className="cursor-pointer">
                  <img
                    src="/profile.svg"
                    alt="Profile"
                    className="w-7 h-7  rounded-full mt-0.5"
                  />
                </Link>
                <div className="text-xs">Login</div>
              </div>

              {/* Shopping Cart Link */}
              <Link href="/cart">
                <div className="flex flex-col">
                <Link href="/cart" className="cursor-pointer">
                  <img
                    src="/bag.svg"
                    alt="bag"
                    className="w-7 h-7   mt-0.5"
                  />
                </Link>
                </div>
                <div className="text-xs ml-1">Cart</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
