"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useCartStore from "@/store/CartStore";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartSummary() {
  const router = useRouter();
  const { cart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = cart.length === 0 ? 0 : subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10" && !isPromoApplied) {
      setDiscount(subtotal * 0.1);
      setIsPromoApplied(true);
    }
  };
  console.log(cart);

  return (
    <Card>
      <CardHeader className="mt-6">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping Charges</span>
          <span>{shipping === 0 ? "Free" : "₹₹{shipping.toFixed(2)}"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (Including GST)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between font-medium text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className="pt-4">
          <Label htmlFor="promo-code">Promo Code</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              id="promo-code"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={isPromoApplied}
            />
            <Button
              variant="outline"
              onClick={applyPromoCode}
              disabled={isPromoApplied || !promoCode}
            >
              {isPromoApplied ? <Check className="h-4 w-4 mr-2" /> : null}
              {isPromoApplied ? "Applied" : "Apply"}
            </Button>
          </div>
          {isPromoApplied && (
            <p className="text-sm text-green-600 mt-1">
              Promo code applied successfully!
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push("/checkout")}
          className="w-full bg-green-500 mb-6 hover:bg-green-700"
          size="lg"
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
