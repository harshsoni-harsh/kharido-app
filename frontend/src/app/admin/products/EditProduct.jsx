"use client";

import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function EditProduct({
  isEditProductOpen,
  setIsEditProductOpen,
  selectedProduct,
  category,
  updateProduct,
  handleCategories,
}) {
  return (
    <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product information</DialogDescription>
        </DialogHeader>
        {selectedProduct && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-product-name" className="mb-2 block">
                  Product Name
                </Label>
                <Input
                  id="edit-product-name"
                  defaultValue={selectedProduct.name}
                  onChange={(e) => {
                    console.log(selectedProduct);
                    selectedProduct.name = e.target.name;
                  }}
                />
              </div>
              <div>
                <Label htmlFor="edit-price" className="mb-2 block">
                  Price (₹)
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  defaultValue={selectedProduct.price}
                  onChange={(e) => {
                    console.log(selectedProduct);
                    try {
                      selectedProduct.price = parseFloat(
                        e.target.value
                      ).toFixed(2);
                    } catch (e) {
                      console.log("not a number");
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="edit-stock" className="mb-2 block">
                  Stock Quantity
                </Label>
                <Input
                  id="edit-stock"
                  type="number"
                  defaultValue={selectedProduct.stock}
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
              <div>
                <Label htmlFor="edit-category" className="mb-2 block">
                  Category
                </Label>
                <Select
                  defaultValue={
                    ""
                    // selectedProduct.category?.toLowerCase()
                  }
                  onValueChange={(value) => {
                    console.log("Selected ID:", value);
                    handleCategories(value); // Call your handler function
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white"
                  >
                    {category.map((item) => (
                      <SelectItem value={item._id}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-brand" className="mb-2 block">
                  Brand
                </Label>
                <Input
                  id="edit-brand"
                  placeholder="Enter brand name"
                  onChange={(e) => {
                    console.log(selectedProduct);

                    selectedProduct.brand = e.target.value;
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description" className="mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter product description"
                  defaultValue={selectedProduct.description}
                  onChange={(e) => {
                    console.log(selectedProduct);

                    selectedProduct.description = e.target.value;
                  }}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-image" className="mb-2 block">
                  Product Images
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="h-24 w-24 rounded-md border">
                    {/* <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    /> */}
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
            onClick={async () => {
              setIsEditProductOpen(false);
              await fetchProduct();
            }}
          >
            Cancel
          </Button>
          <Button
            className={"bg-black text-white"}
            onClick={async () => {
              setIsEditProductOpen(false);
              await updateProduct();
            }}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
