"use client"
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingBag } from "lucide-react";
import { List } from "lucide-react";
import { MapPinHouse } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginDialog({ isOpen, onOpenChange, userName }) {
  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    window.location.reload();
  };
  const router = useRouter()

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        {userName ? userName : "Login"}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onClick = {()=>router.push('/addreses')}>
          <User />
          <span>Profile</span>
  
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShoppingBag />
          <span>Orders</span>
         
        </DropdownMenuItem>
        <DropdownMenuItem>
          <List />
          <span>Shopping Lists</span>
         
        </DropdownMenuItem>
        <DropdownMenuItem>
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
         <LogOut/>
          <span>Continue with Google</span>
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>

  )
}
