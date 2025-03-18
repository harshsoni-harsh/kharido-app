"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Plus,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";


// Sample product data
const products = [
  {
    id: 1,
    name: "Organic Apples",
    price: 180,
    category: "Fruits",
    stock: 150,
    image: "/images/banana.jpg",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Fresh Milk",
    price: 75,
    category: "Dairy",
    stock: 75,
    image: "/images/banana.jpg",
    status: "In Stock",
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: 34,
    category: "Bakery",
    stock: 45,
    image: "/images/banana.jpg",
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Free Range Eggs",
    price: 90,
    category: "Dairy",
    stock: 100,
    image: "/images/banana.jpg",
    status: "In Stock",
  },
  {
    id: 5,
    name: "Organic Spinach",
    price: 35,
    category: "Vegetables",
    stock: 30,
    image: "/images/banana.jpg",
    status: "Low Stock",
  },
  {
    id: 6,
    name: "Chicken Breast",
    price: 220,
    category: "Meat",
    stock: 60,
    image: "/images/banana.jpg",
    status: "In Stock",
  },
  {
    id: 7,
    name: "Atlantic Salmon",
    price: 780,
    category: "Seafood",
    stock: 25,
    image: "/images/banana.jpg",
    status: "Low Stock",
  },
  {
    id: 8,
    name: "Avocados",
    price: 160,
    category: "Fruits",
    stock: 0,
    image: "/images/banana.jpg",
    status: "Out of Stock",
  },
];

export default function product() {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen} >
            <DialogTrigger asChild>
              <Button className= "bg-black text-white">
                <Plus className="mr-2 h-4 w-4 text-white" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Add a new product to your grocery inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="product-name" className="mb-2 block">Product Name</Label>
                    <Input id="product-name" placeholder="Enter product name" />
                  </div>
                  <div>
                    <Label htmlFor="price" className="mb-2 block">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock" className="mb-2 block">Stock Quantity</Label>
                    <Input id="stock" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="category" className="mb-2 block">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="seafood">Seafood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brand" className="mb-2 block">Brand</Label>
                    <Input id="brand" placeholder="Enter brand name" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description" className="mb-2 block">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="image" className="mb-2 block">Product Images</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <Button variant="outline" className="h-24 w-24">
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-4 w-4" />
                          <span className="text-xs">Upload</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddProductOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsAddProductOpen(false)}>
                  Save Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update product information
                </DialogDescription>
              </DialogHeader>
              {selectedProduct && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="edit-product-name"className="mb-2 block">Product Name</Label>
                      <Input
                        id="edit-product-name"
                        defaultValue={selectedProduct.name}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-price" className="mb-2 block">Price (₹)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        defaultValue={selectedProduct.price}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-stock" className="mb-2 block">Stock Quantity</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        defaultValue={selectedProduct.stock}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category" className="mb-2 block">Category</Label>
                      <Select
                        defaultValue={selectedProduct.category.toLowerCase()}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fruits">Fruits</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                          <SelectItem value="dairy">Dairy</SelectItem>
                          <SelectItem value="bakery">Bakery</SelectItem>
                          <SelectItem value="meat">Meat</SelectItem>
                          <SelectItem value="seafood">Seafood</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-brand" className="mb-2 block">Brand</Label>
                      <Input id="edit-brand" placeholder="Enter brand name" />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit-description" className="mb-2 block">Description</Label>
                      <Textarea
                        id="edit-description"
                        placeholder="Enter product description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="edit-image" className="mb-2 block">Product Images</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="h-24 w-24 rounded-md border">
                          <Image
                            src={selectedProduct.image || "/placeholder.svg"}
                            alt={selectedProduct.name}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button variant="outline" className="h-24 w-24">
                          <div className="flex flex-col items-center gap-1">
                            <Upload className="h-4 w-4" />
                            <span className="text-xs">Upload</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditProductOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsEditProductOpen(false)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4"/>
                Export
                <ChevronDown className="ml-2 h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mt-5">
            <CardTitle className="text-lg">Product Inventory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Stock
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₹{product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "In Stock"
                          ? "default"
                          : product.status === "Low Stock"
                          ? "warning"
                          : "destructive"
                      }
                      className={`${
                        product.status === "In Stock"
                          ? "bg-green-500 text-white"
                          : product.status === "Low Stock"
                          ? "bg-white text-black"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                          <path d="m15 5 4 4"></path>
                        </svg>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
