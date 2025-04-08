"use client";

import Page from "../products/page";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard"; // assuming this path
import usePublicStore from "@/store/PublicStore";
import axios from "axios";

export default function searchPage() {
  // const { query } =  params;
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { categories, products, loading, fetchCategories, fetchAllProducts } =
    usePublicStore();

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query")?.toLocaleLowerCase() || "";

  useEffect(()=>{
    fetchSearchProducts();
  },[searchQuery])
  async function fetchSearchProducts() {
    try {
      console.log(searchQuery)
      setFilteredProducts([])
      const res = await axios.post("/api/public/search-products", {
        query: searchQuery,
        sortOptions: {
          field: "price",
          order: "asc",
        }
        
      });
      console.log(res.data);
      setFilteredProducts(res.data.data.results);
    } catch (error) {
      console.log("Search failed", error);
    }
  }

  return (
    <div className="lg:mx-16 md:mx-8 sm:mx-4 mt-10 mb-12">
      <h2 className="text-2xl font-bold mb-6">
        {searchQuery ? `Results for "${searchQuery}"` : "Explore Products"}
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={index}
              id={product._id}
              imageLinks={product.imageLinks}
              name={product.name}
              rating={product.rating}
              price={product.price}
              brand={product.brand}
            />
          ))}
        </div>
      )}
    </div>
  );
}
