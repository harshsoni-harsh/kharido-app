"use client";

import { ArrowUpDown, Trash } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ExportData from "./ExportData";
import EditProduct from "./EditProduct";

export default function ProductTable({
  products,
  deleteProduct,
  handleEditProduct,
}) {
  return (
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
        {products.map((product, idx) => {
          
          if(product.discontinued==="true")
          {
            return;
          }
          return (
            <TableRow key={idx}>
              <TableCell>
                <Image
                  src={product.imageLinks || "/placeholder.svg"}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>₹{product.price}</TableCell>x
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
                    className={"hover:text-blue-600 hover:bg-blue-100"}
                    onClick={() => {
                      console.log("edit", product);
                      handleEditProduct(product);
                    }}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={"hover:text-red-600 hover:bg-red-100"}
                    onClick={() => deleteProduct(product._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
