import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductPage from "./ProductPage";

const FRONTEND_URI = process.env.FRONTEND_URI ?? "http://localhost:3000";

async function fetchProductDetails(productId) {
  try {
    const res = await axios.post(`${FRONTEND_URI}/api/public/get-product`, {
      productId,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching products: ", error);
    return null;
  }
}

export default async function Page({ params }) {
  const { productId } = await params;

  const product = await fetchProductDetails(productId);

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const minQuantity = 1;

  return <ProductPage {...{ product }} />;
}
