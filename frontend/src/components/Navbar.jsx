"use client";

import React, { useState } from "react";
import Link from "next/link";
import LoginDialog from "./LoginDialog";
import { useEffect } from "react";
import { useUserStore } from "@/store/UserStore";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, fetchUser } = useUserStore();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="sticky top-0 left-0 w-full z-50 shadow-md h-16 bg-white px-4 md:px-6">
      <div className=" text-black   flex flex-row  gap-4 md:gap-8 mt-3 justify-between">
        <div className="flex flex-row  gap-6 md:gap-10">
          <div className="px-4  text-3xl font-semibold">
            <Link href="/" className="text-green-500">{`Khareedo`}</Link>
          </div>
          <div>
            <div className="hidden lg:flex  items-center">
              <ul className="flex flex-row gap-6 mt-2 ">
                <li>
                  <Link href={"/"}>Home</Link>
                </li>
                <li>
                  <Link href={"/products"}>Shop</Link>
                </li>
                <li>
                  <Link href={"/"}>About us</Link>
                </li>
                <li>
                  <Link href={"/admin"}>Admin</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 md:gap-6">
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-full max-w-[24rem] md:max-w-[30rem] px-4 border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-gray-300 bg-white shadow-sm"
          />

          <div className="flex items-center gap-4">
            {/* Profile Link */}
            {isLoggedIn ? (
              // When logged in, profile link navigates to profile page
              <Link href="/profile" className="flex flex-col items-center">
                <div className="cursor-pointer">
                  <img
                    src="/profile.svg"
                    alt="Profile"
                    className="w-7 h-7 rounded-full mt-0.5"
                  />
                </div>
                <div className="text-xs">Profile</div>
              </Link>
            ) : (
              // When not logged in, profile link opens login dialog
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <div>
                  <img
                    src="/profile.svg"
                    alt="Profile"
                    className="w-7 h-7 rounded-full mt-0.5"
                  />
                </div>
                <div className="text-xs text-nowrap truncate">
                  {user?.name ?? "Login"}
                </div>
              </div>
            )}

            <LoginDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              userName={user?.name}
            />

            {/* Shopping Cart Link */}
            <div>
              <div className="flex flex-col">
                <Link href="/cart" className="cursor-pointer">
                  <img src="/bag.svg" alt="bag" className="w-7 h-7 mt-0.5" />
                </Link>
              </div>
              <div className="text-xs ml-1">Cart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
