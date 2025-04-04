"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
} from "lucide-react";

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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

// Sample inventory data
const inventory = [
  {
    id: 1,
    name: "Organic Apples",
    sku: "FRUIT-001",
    category: "Fruits",
    stock: 150,
    minStock: 50,
    supplier: "Organic Farms Inc.",
    lastRestocked: "2023-08-10",
  },
  {
    id: 2,
    name: "Fresh Milk",
    sku: "DAIRY-001",
    category: "Dairy",
    stock: 75,
    minStock: 30,
    supplier: "Local Dairy Co.",
    lastRestocked: "2023-08-12",
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    sku: "BAKERY-001",
    category: "Bakery",
    stock: 45,
    minStock: 40,
    supplier: "Artisan Bakery",
    lastRestocked: "2023-08-14",
  },
  {
    id: 4,
    name: "Free Range Eggs",
    sku: "DAIRY-002",
    category: "Dairy",
    stock: 100,
    minStock: 50,
    supplier: "Happy Hens Farm",
    lastRestocked: "2023-08-11",
  },
  {
    id: 5,
    name: "Organic Spinach",
    sku: "VEG-001",
    category: "Vegetables",
    stock: 30,
    minStock: 40,
    supplier: "Green Fields Co.",
    lastRestocked: "2023-08-13",
  },
  {
    id: 6,
    name: "Chicken Breast",
    sku: "MEAT-001",
    category: "Meat",
    stock: 60,
    minStock: 30,
    supplier: "Premium Meats Ltd.",
    lastRestocked: "2023-08-09",
  },
  {
    id: 7,
    name: "Atlantic Salmon",
    sku: "SEAFOOD-001",
    category: "Seafood",
    stock: 25,
    minStock: 20,
    supplier: "Ocean Fresh Seafood",
    lastRestocked: "2023-08-08",
  },
  {
    id: 8,
    name: "Avocados",
    sku: "FRUIT-002",
    category: "Fruits",
    stock: 0,
    minStock: 30,
    supplier: "Tropical Imports",
    lastRestocked: "2023-08-01",
  },
];

// Get low stock items
const lowStockItems = inventory.filter((item) => item.stock <= item.minStock);


export default function InventoryPage() {
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [minStockQuantity , setMinStockQuantity] = useState(50);
  // const [newCatName, setNewCatName] = useState("");
  // const  [newCatSku, setNewCatSku] = useState("");
  // const [newCatDescription, setNewCatDescription] = useState("");
  // const [newCatSearchTags, setNewCatSearchTags] = useState("");
  // const [newCatDefaultTax, setNewCatDefaultTax] = useState(18);
  // const [newCatImageLinks,setNewCatImageLink] = useState("")

  const [categoryData, setCategoryData] = useState({
    name: '',
    sku: '',
    description: '',
    searchTags: [],
    defaultTax: 18,
    imageLinks: [],
  });
  

  const handleRestock = (item) => {
    setSelectedItem(item);
    setIsRestockOpen(true);
  };

  const handleCategory = (item) => {
    setCategory(item);
    setIsDialogOpen(true);
  };

  const getStockStatus = (item) => {
    if (item.stock === 0) {
      return { status: "Out of Stock", variant: "destructive" };
    } else if (item.stock <= minStockQuantity) {
      return { status: "Low Stock", variant: "warning" };
    } else {
      return { status: "In Stock", variant: "default" };
    }
  };

  const getStockPercentage = (item) => {
    const target = Math.max(minStockQuantity * 1, 100);
    console.log(`stock percen: ${Math.min(Math.round((item.stock / target) * 100), 100)}`)
    return Math.min(Math.round((item.stock / target) * 100), 100);
  };

  function getLowStockItemCount(){
  let count = 0;
  products.forEach((item) => {
    if(item.stock<=minStockQuantity ) count++;
  })  
  return count;
}

function getOutOfStockItemCount(){
  let count = 0;
  products.forEach((item) => {
    if(item.stock ==0) count++;
  })  
  return count;
}

const handleInputChange = (name,value) => {
  
  setCategoryData(prev => ({ ...prev, [name]: value }));
};

const handleArrayInputChange = (name,value) => {

  const arrayValue = value.split(' ').filter(item => item.trim() !== '');
  setCategoryData(prev => ({ ...prev, [name]: arrayValue }));
};

const handleNumberChange = (name,value) => {
 
  setCategoryData(prev => ({ ...prev, [name]: Number(value) }));
};

async function createCategory() {
  try {
   
    const res = await axios.post("/api/admin/categories/create", {
      ...categoryData
    
    });
    
    console.log(res.data);
    alert(res.data.message);
    fetchProduct();
    
   
    setCategoryData({
      name: '',
      sku: '',
      description: '',
      searchTags: [],
      defaultTax: 18,
      imageLinks: [],
     
    });
  } catch (error) {
    console.error("Error creating category:", error);
    alert("Failed to create category. Please try again.");
  }
}

  async function fetchProduct() {
    const res = await axios.post("/api/public/get-products-range", {
      startIndex: 0,
      endIndex: 11,
    });
    console.log(res.data);
    const activeProducts = res.data.data.products.filter((item)=>{
       return item.discontinued === "false"
    })
    console.log(activeProducts)
    setProducts(activeProducts);
    
    setTotalProducts(res.data.data.pagination.totalCount)
  }

  async function getCategory() {
    const res = await axios.post("/api/public/get-categories");
    console.log(res.data);
    setCategory(res.data.data.categories);
  }
  

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
    console.log(res.data);
    alert(res.data.message);
    setCategory(res.data.data.categories);
  }
  useEffect(() => {
    fetchProduct();
    getCategory();
  }, []);

  function getCategoryName(id) {
    const cat = category.find((item) => item._id === id);
    console.log(cat);
    if (cat) return cat.name;
    else return "unknown";
  }

  function getDate(item) {
    return item
      ? new Date(item).toLocaleDateString().toLowerCase()
      : "";
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-2 ">
          <Button
            className="bg-black text-white hover:bg-slate-700"
            onClick={() => setIsCatDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>

          {/* Category Dialog */}
          <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
            <DialogContent className="sm:max-w-[400px] bg-white">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category Name"
                    value={categoryData.name}
              
                    onChange={(e) => {handleInputChange("name",e.target.value)
                       console.log(categoryData)}}
                    placeholder="Enter category name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    SKU
                  </Label>
                  <Input
                    id="category sku"
                    value={categoryData.sku}
              
                    onChange={(e) => {handleInputChange("sku",e.target.value)
                      console.log(categoryData)}}
                    placeholder="Enter SKU"
                    className="col-span-3"
                  />
                </div>
                <div className="col-span-2">
                <Label htmlFor="edit-description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter category description"
                  defaultValue={categoryData.description}
                  onChange={(e) => {
                    handleInputChange("description",e.target.value)
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description" className="mb-2 block">
                  Image Links
                </Label>
                <Textarea
                  id="edit-imageLinks"
                  placeholder="Enter category description"
                  defaultValue={""}
                  onChange={(e) => {
                    handleArrayInputChange("imageLinks",e.target.value)
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description" className="mb-2 block">
                  SearchTags
                </Label>
                <Textarea
                  id="edi-searchTags"
                  placeholder="Enter category description"
                  defaultValue={""}
                  onChange={(e) => {
                    handleArrayInputChange("searchTags",e.target.value)
                  }}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-description" className="mb-2 block">
                  Default Tax
                </Label>
                <Textarea
                  id="edit-tax"
                  placeholder="Enter tax percent"
                  defaultValue={categoryData.defaultTax}
                  onChange={(e) => {
                    handleNumberChange("defaultTax",e.target.value)
                  }}
                />
              </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCatDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("New Category:", category);
                    createCategory();
                    setIsCatDialogOpen(false);
                  }}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            {getLowStockItemCount()} products are running low on stock and need to
            be restocked.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products (including discontinued)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {category.length}{" "}
              categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLowStockItemCount()}</div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock level on this page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getOutOfStockItemCount()}
            </div>
            <p className="text-xs text-muted-foreground">
              Items that need immediate attention on this page
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mt-5">
            <CardTitle className="text-lg">Inventory Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Stock Level
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((item) => {
                const stockStatus = getStockStatus(item);
                const stockPercentage = getStockPercentage(item);

                return (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku|| "not set"}</TableCell>
                    <TableCell>{getCategoryName(item.category[0])}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>{item.stock} units</span>
                          <span>Min: {minStockQuantity}</span>
                        </div>
                        <Progress
                          value={stockPercentage}
                          className={
                            stockStatus.variant === "destructive"
                              ? "bg-red-200"
                              : stockStatus.variant === "warning"
                              ? "bg-yellow-200"
                              : ""
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={stockStatus.variant}
                        className={`${
                          stockStatus.status === "In Stock"
                            ? "bg-green-500 text-white"
                            : stockStatus.status === "Out of Stock"
                            ? "bg-red-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {stockStatus.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{getDate(item.updatedAt || item.createdAt || "")}</TableCell>
                    <TableCell className="text-right bg-white">
                      <Button
                        variant={
                          stockStatus.variant === "default"
                            ? "outline"
                            : "default"
                        }
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(item);
                          handleRestock(item);
                        }}
                      >
                        Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>
              {selectedItem && `Add inventory for ${selectedItem.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-stock" className="text-right">
                  Current Stock
                </Label>
                <Input
                  id="current-stock"
                  value={selectedItem.stock}
                  disabled
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-stock" className="text-right">
                  Add Stock
                </Label>
                <Input
                  id="add-stock"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  className="col-span-3"
                  onChange={(e) => {
                    console.log(selectedProduct);
                    try {
                      selectedProduct.stock = parseInt(e.target.value);
                    } catch (e) {
                      console.log("not a number");
                    }
                  }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateProduct(selectedProduct);
                setIsRestockOpen(false);
                fetchProduct()
              }}
              className={"bg-black text-white"}
            >
              Confirm Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
