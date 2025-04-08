"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Subscribed with:", email);
    setEmail("");
    // You could add toast notification here
  };

  return (
    <footer className="border-t bg-slate-200 pl-8 mt-auto">
      <div className="container px-4 py-10 md:py-16 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 justify-between">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-3xl text-green-500">Khareedo</span>
            </Link>
            <p className="text-muted-foreground text-md">
            We offer the best selection of fresh, organic produce and groceries at competitive 
            prices with excellent customer service.
            </p>
            <div className="flex gap-4 mt-2">
              <Link
                href="#"
                className="text-muted-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shops</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  Fruits & Vegetable
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  Dairy & Bread
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                    Backery & Biscuit
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  ColdDrinks & Juices
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  Snacks & Munchies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Services</h3>
            <ul className="space-y-2">
            <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                    Countact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500"
                >
                    Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-gray-500 "
                >
                  Help center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact US */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
                <li>
                    <p className="hover:text-gray-500">123 south Rajendranagar, Delhi , 10001</p>
                </li>
                <li>
                    <p className = "hover:text-gray-500">Email: Fresh@Khareedo.com</p>
                </li>
                <li>
                    <p className = "hover:text-gray-500">Phone: +91 98233-78903</p>
                </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex justify-center items-center ">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Khareedo All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
