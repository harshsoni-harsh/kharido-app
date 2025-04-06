"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/CategoryCard.jsx";
import axios from "axios";

const CategoriesPage = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.post(
          `/api/public/get-categories`,
          {}
        );
        setCategoriesList(res.data.data.categories);
      } catch (error) {
        console.error("Error fetching products:", error);
        setCategoriesList([]);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <div className="flex flex-col p-4 mt-4">
        <div className="text-3xl mb-4 font-bold ">Shop by Category</div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full max-w-8xl items-center ">
          {categoriesList.map((category, index) => (
            <CategoryCard
              key={index}
              imageUrl={category.imageLinks[0] ?? ""}
              category={category.name}
              link={`/categories/${category._id}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
