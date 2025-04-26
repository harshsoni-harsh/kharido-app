"use client";
import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import usePublicStore from "@/store/PublicStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CategoryClient({ categoryId }) {
  const {
    products: AllProducts,
    categories,
    fetchProducts,
    loading,
  } = usePublicStore();

  useEffect(() => {
    if (categoryId) fetchProducts(categoryId);
  }, [categoryId]);

  const products = AllProducts[categoryId] ?? [];
  const categoryName = categories?.find(
    (category) => category._id === categoryId,
  )?.name;

  if (loading) return <Loader />;
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
          <div className="text-2xl mb-4 font-bold mt-4">{categoryName}</div>
          <Button className="w-fit m-4 text-semibold bg-green-500 rounded-2xl hover:bg-green-700">
            See all →
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center">
          {products?.map((product, index) => (
            <ProductCard
              key={index}
              id={product._id}
              imageLinks={product.imageLinks}
              name={product.name}
              rating={product.rating}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
