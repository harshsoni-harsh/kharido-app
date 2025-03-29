"use client";

import { useState } from "react";
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
  const [category, setCategory] = useState("");

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
    } else if (item.stock <= item.minStock) {
      return { status: "Low Stock", variant: "warning" };
    } else {
      return { status: "In Stock", variant: "default" };
    }
  };

  const getStockPercentage = (item) => {
    const target = Math.max(item.minStock * 2, 100);
    return Math.min(Math.round((item.stock / target) * 100), 100);
  };

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
            onClick={() => handleCategory("")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>

          {/* Category Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category name"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("New Category:", category); // Handle category addition logic here
                    setIsDialogOpen(false);
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
            {lowStockItems.length} products are running low on stock and need to
            be restocked.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(inventory.map((item) => item.category)).size}{" "}
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
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock level
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter((item) => item.stock === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items that need immediate attention
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
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const stockPercentage = getStockPercentage(item);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span>{item.stock} units</span>
                          <span>Min: {item.minStock}</span>
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
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.lastRestocked}</TableCell>
                    <TableCell className="text-right bg-white">
                      <Button
                        variant={
                          stockStatus.variant === "default"
                            ? "outline"
                            : "default"
                        }
                        size="sm"
                        onClick={() => handleRestock(item)}
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
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Select
                  defaultValue={selectedItem.supplier
                    .toLowerCase()
                    .replace(/\s+/g, "-")}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organic-farms-inc">
                      Organic Farms Inc.
                    </SelectItem>
                    <SelectItem value="local-dairy-co">
                      Local Dairy Co.
                    </SelectItem>
                    <SelectItem value="artisan-bakery">
                      Artisan Bakery
                    </SelectItem>
                    <SelectItem value="happy-hens-farm">
                      Happy Hens Farm
                    </SelectItem>
                    <SelectItem value="green-fields-co">
                      Green Fields Co.
                    </SelectItem>
                    <SelectItem value="premium-meats-ltd">
                      Premium Meats Ltd.
                    </SelectItem>
                    <SelectItem value="ocean-fresh-seafood">
                      Ocean Fresh Seafood
                    </SelectItem>
                    <SelectItem value="tropical-imports">
                      Tropical Imports
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  placeholder="Optional notes"
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsRestockOpen(false)}>
              Confirm Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
