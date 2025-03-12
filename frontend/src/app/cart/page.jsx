import CartItems from "@/components/cart-items"
import CartSummary from "@/components/cart-summary"
import { ShoppingCart } from "lucide-react"

function page() {
  return (
    <div className="container mx-auto py-10 px-4 mt-20">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-3xl font-semibold text-green-500">Your Cart</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <CartItems />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}

export default page;
