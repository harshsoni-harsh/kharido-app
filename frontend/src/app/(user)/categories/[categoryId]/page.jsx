import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ProductCard from "@/components/ProductCard";

const FRONTEND_URI = process.env.FRONTEND_URI ?? "http://localhost:3000";

async function fetchCategoryProducts(categoryId) {
  try {
    const res = await axios.post(
      `${FRONTEND_URI}/api/public/get-category-products`,
      { categoryId }
    );
    return res.data?.data?.products ?? [];
  } catch (error) {
    console.error("Error fetching products: ", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { categoryId } = await params;

  const products = await fetchCategoryProducts(categoryId);

  if (!products) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="flex flex-col rounded-2xl p-4 shadow-lg">
        <div className="flex  flex-row justify-between">
          <div className="text-2xl mb-4 font-bold mt-4">{categoryId}</div>
          <Button className="w-fit m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
            See all →
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
          {products?.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              name={product.name}
              rating={product.rating}
              price={product.price}
              quantity={product.quantity}
              imageLinks={product.imageLinks}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
