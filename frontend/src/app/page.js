import { Button, buttonVariants } from "@/components/ui/button";
import HorizontalCardSlider from "@/components/HorizontalCardSlider";
import Banner from "@/components/Banner";
import CategoriesPage from "@/components/Categories";
import Featured_products from "@/components/Featured_products";
import ProductCard from "@/components/ProductCard";


export default function Home() {
  return (
    <>
       <Banner/>
       <CategoriesPage/>
       <Featured_products/>
       {/* <ProductCard image={"/images/Backery_biscuit.jpg"} name={"Apple"} price={112} rating={4}  key={9} /> */}
    </>
  
  ) 
}