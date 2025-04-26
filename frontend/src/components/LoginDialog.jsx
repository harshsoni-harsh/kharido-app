"use client";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingBag } from "lucide-react";
import { List } from "lucide-react";
import { MapPinHouse } from "lucide-react";
import { useRouter } from "next/navigation";

const a = 2;

export default function LoginDialog({ isOpen, onOpenChange, userName }) {
  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Cookies are cleared server-side; no client-side action needed
      // Optionally redirect if the gateway doesn't handle it
      // window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.location.href = "/api/auth/google";
    }
  };
  const router = useRouter();

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{userName ? userName : "Login"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/orders")}>
            <ShoppingBag />
            <span>Orders</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <List />
            <span>Shopping Lists</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/addresses")}>
            <MapPinHouse />
            <span>My Addresses</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {userName ? (
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLogin}>
            <LogOut />
            <span>Continue with Google</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
