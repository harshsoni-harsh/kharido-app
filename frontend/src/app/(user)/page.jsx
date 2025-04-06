import Banner from "@/components/Banner";
import CategoriesPage from "@/components/Categories";
import Featured_products from "@/components/Featured_products";

export default function Home() {
  
  return (
    <div className="lg:mx-16 md:mx-8 sm:mx-4 mb-8">
       <Banner/>
       <CategoriesPage/>
       <Featured_products/>
       {/* <ProductCard image={"/images/Backery_biscuit.jpg"} name={"Apple"} price={112} rating={4}  key={9} /> */}
       
    </div>
  
  ) 
}