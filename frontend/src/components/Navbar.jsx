"use client";

import useCartStore from "@/store/CartStore";
import { useUserStore } from "@/store/UserStore";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import LoginDialog from "./LoginDialog";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, fetchUser } = useUserStore();
  const { cart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setIsDialogOpen(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload
    if (searchQuery.trim()) {
      router.push(
        `/SearchProduct?query=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
  };

  return (
    <div className="sticky top-0 left-0 w-full z-50 shadow-md h-16 bg-white px-4 md:px-6">
      <div className=" text-black   flex flex-row  gap-4 md:gap-8 mt-3 justify-between">
        <div className="flex flex-row  gap-6 md:gap-10">
          <div className="px-4  text-3xl font-semibold">
            <Link href="/" className="text-green-500">
              {"Khareedo"}
            </Link>
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
          <form
            onSubmit={handleSearch}
            className="flex gap-2 w-full max-w-[30rem]"
          >
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              className="h-10 w-full px-4 border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none 
        focus:ring-2 focus:ring-gray-300 bg-white shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
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
            <div className="text-center flex flex-col gap-1">
              <div className="flex flex-col relative">
                <Link href="/cart" className="cursor-pointer">
                  <Image
                    width={28}
                    height={28}
                    src="/bag.svg"
                    alt="bag"
                    className={clsx(
                      "mt-0.5",
                      cart?.length && cart.length > 0 && "filter-green-effect",
                    )}
                  />
                </Link>
              </div>
              <div className="text-xs">Cart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
