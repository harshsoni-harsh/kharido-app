"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ExportData from "./ExportData";
import ProductTable from "./ProductTable";

export default function Products() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleAddProduct = async (product) => {
    if (!product.name || !product.brand || !product.category) {
      toast.error("Name, brand and category is required");
      return;
    }

    try {
      const { data } = await axios.post("/api/admin/products/create", product);
      console.dir({ data });
      if (data.statusCode !== 201) {
        throw new Error(data);
      }
      toast.success("Product added successfully");
      setIsAddProductOpen(false);
    } catch (err) {
      toast.error("Error adding product. Check console.");
      console.log(err);
    }
  };

  async function fetchProduct() {
    const res = await axios.post("/api/public/get-products-range", {
      startIndex: 0,
      endIndex: 1000,
    });
    setProducts(res.data.data.products);
  }

  async function getCategory() {
    const res = await axios.post("/api/public/get-categories");
    setCategories(res.data.data.categories);
  }

  useEffect(() => {
    fetchProduct();
    getCategory();
  }, []);

  async function updateProduct() {
    const res = await axios.post("/api/admin/products/update", {
      _id: selectedProduct._id,
      imageLinks: selectedProduct.imageLinks,
      brand: selectedProduct.brand,
      stock: selectedProduct.stock,
      description: selectedProduct.description,
      name: selectedProduct.name,
      price: selectedProduct.price,
    });
    toast.success(res.data.message);
    setCategories(res.data.data.categories);
    fetchProduct();
  }

  const handleCategories = async (categories) => {
    await axios.post("/api/admin/products/update", {
      category: categories ?? [],
    });
  };

  const deleteProduct = async (productId) => {
    const res = await axios.post("/api/admin/products/delete", {
      productId,
    });
    toast.success(res.data.message);
    await fetchProduct();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your grocery products</p>
        </div>
        <div className="flex items-center gap-2 ">
          <AddProduct
            {...{
              isAddProductOpen,
              setIsAddProductOpen,
              handleAddProduct,
              category: categories,
            }}
          />
          <EditProduct
            {...{
              isEditProductOpen,
              setIsEditProductOpen,
              selectedProduct,
              category: categories,
              updateProduct,
              handleCategories,
              setSelectedProduct,
            }}
          />
          <ExportData />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Product Inventory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProductTable
            {...{ products, deleteProduct, handleEditProduct, categories }}
          />
        </CardContent>
      </Card>
    </>
  );
}
