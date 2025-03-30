'use client'
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/ui/CategoryCard.jsx";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import axios from "axios";




const categories = [
  {
    name: "Fruits and Vegetables",
    imageUrl: "/images/Fruits_Vegetable.jpg",
    link: "/categories/fruits",
  },
  {
    name: "Dairy,Bread and Egg",
    imageUrl: "/images/Dairy_bread.jpg",
    link: "/categories/dairy",
  },
  {
    name: "Bakery and Biscuit",
    imageUrl: "/images/Backery_biscuit.jpg",
    link: "/categories/bakery",
  },
  {
    name: "Snacks and Munchies",
    imageUrl: "/images/snack.jpg",
    link: "/categories/frozen",
  },
  {
    name: "Cold Drinks and Juices",
    imageUrl: "/images/cold_drinks.jpg",
    link: "/categories/frozen",
  },
];



const CategoriesPage = () => {

  const [categoriesList, setCategoriesList] = useState([]);

  

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.post("http://localhost:3000/public/get-categories",{});
        setCategoriesList(res.data.data.categories);
        console.log(res.data.data.categories); 
      } catch (error) {
        console.error("Error fetching products:", error);
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
              imageUrl={""}
              category={category.name}
              link={""}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
