"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  Filter,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

// Sample order data

export default function Order() {
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalorder, setTotalOrder] = useState([]);
  const [filteredOrder, setFilterOrder] = useState([]);
  const [updateStatus, setUpdateStatus] = useState([]);

  

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.post("/api/admin/orders/range", {
          startIndex: 0,
          endIndex: 3,
        });
        console.log(res.data);
        setTotalOrder(res.data.orders);
        setFilterOrder(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    }

    fetchOrders();
  }, []);

  async function UpdateOrderStatus(orderId, status) {
    try {
      console.log(orderId,status)
      const res = await axios.post("/api/admin/orders/update", {
        orderId: orderId,
        status: status,
      });
      alert(res.data.statusCode)
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewOrderOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "info";
      case "Processing":
        return "warning";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "Success":
        return "default";
      case "Pending":
        return "warning";
      case "Refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  function filterOrders() {
    return totalorder.filter((order) => {
      const query = searchQuery.toLowerCase();

      return (
        (order.id?.toLowerCase() || "").includes(query) ||
        (order._id?.toLowerCase() || "").includes(query) ||
        (order.email?.toLowerCase() || "").includes(query) ||
        (order.paymentMode?.toLowerCase() || "").includes(query) ||
        (order.price?.toString() || "").includes(query) ||
        (order.createdAt
          ? new Date(order.createdAt).toLocaleDateString().toLowerCase()
          : ""
        ).includes(query) ||
        (Array.isArray(order.status) &&
          order.status.some((s) => s.property?.toLowerCase().includes(query)))
      );
    });
  }
  console.log("Search Quary", searchQuery);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <div className="flex items-center gap-2">
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

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mt-5">
            <CardTitle className="text-lg">Order Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilterOrder(filterOrders());
                  console.log(filteredOrder);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-zinc-200">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="data-[state=active]:bg-white"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="shipped"
                className="data-[state=active]:bg-white"
              >
                Shipped
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="data-[state=active]:bg-white"
              >
                Delivered
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-white"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>
            {/* Content for all Orders section */}

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Order ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Customer Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Total
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrder.map((order) => (
                    <TableRow key={order.id || "N/A"}>
                      <TableCell className="font-medium">
                        {order._id || "N/A"}
                      </TableCell>
                      <TableCell>{order.email || "N/A"}</TableCell>
                      <TableCell>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        ${order.totalAmount.netAmount || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(order.status?.at(-1)?.property)}
                          className={`${
                            order.status?.[0]?.property === "Delivered"
                              ? "bg-green-500 text-white"
                              : order.status?.[0]?.property === "Cancelled"
                              ? "bg-red-500 text-white"
                              : order.status?.[0]?.property === "Processing"
                              ? "bg-black text-white"
                              : order.status?.[0]?.property === "Shipped"
                              ? "bg-blue-500 text-white"
                              : ""
                          }`}
                        >
                          {order.status?.at(-1)?.property || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getPaymentColor(order.paymentMode)}
                          className={` ${
                            order.paymentMode === "Credit Card"
                              ? "bg-black text-white"
                              : order.paymentMode === "Debit Card"
                              ? "bg-green-500 text-white"
                              : order.paymentMode === "Upi"
                              ? "bg-orange-500 text-white"
                              : order.paymentMode === "Paypal"
                              ? "bg-blue-600 text-white"
                              : ""
                          }
                        `}
                        >
                          {order.paymentMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>{ handleViewOrder(order)}}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>
                                Process Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Content for only with status =  "Processing" section */}

            <TabsContent value="processing">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalorder
                    .filter(
                      (order) => order.status.at(-1).property === "Processing"
                    )
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id}
                        </TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(order.status[0].property)}
                            className={`${
                              order.status === "Delivered"
                                ? "bg-green-500 text-white"
                                : order.status === "Cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {order.status[0].property}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentColor(order.paymentMode)}>
                            {order.paymentMode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Process Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Content for only with status =  "Shipped" section */}

            <TabsContent value="shipped">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalorder
                    .filter((order) => order.status[0].property === "Shipped")
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id}
                        </TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(order.status[0].property)}
                            className={`${
                              order.status === "Delivered"
                                ? "bg-green-500 text-white"
                                : order.status === "Cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {order.status[0].property}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentColor(order.paymentMode)}>
                            {order.paymentMode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Process Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Content for only with status =  "Delivered" section */}

            <TabsContent value="delivered">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalorder
                    .filter((order) => order.status.at(-1).property === "delivered")
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id}
                        </TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${order.totalAmount.netAmount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(order.status.at(-1).property)}
                            className={`${
                              order.status === "delivered"
                                ? "bg-green-500 text-white"
                                : order.status === "Cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {order.status.at(-1).property}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentColor(order.paymentMode)}>
                            {order.paymentMode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Process Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Content for only with status =  "Cancelled" section */}

            <TabsContent value="cancelled">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totalorder
                    .filter((order) => order.status[0].property === "Cancelled")
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order._id}
                        </TableCell>
                        <TableCell>{order.email}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(order.status[0].property)}
                            className={`${
                              order.status === "Delivered"
                                ? "bg-green-500 text-white"
                                : order.status === "Cancelled"
                                ? "bg-red-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {order.status[0].property}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentColor(order.paymentMode)}>
                            {order.paymentMode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Process Refund
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Send Invoice
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white ">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ID: ${selectedOrder.id}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Customer Information</h3>
                  <div className="mt-2 text-sm">
                    <p className="font-medium">{selectedOrder.customer}</p>
                    <p>{selectedOrder.email}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Shipping Address</h3>
                  <p className="mt-2 text-sm">{selectedOrder.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Order Status</h3>
                  <div className="mt-">
                    <Select
                      defaultValue={selectedOrder.status
                        .at(-1)
                        .property.toLowerCase()} 
                      onValueChange={(value) => setUpdateStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="return scheduled">
                          Processing
                        </SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Payment Status</h3>
                  <div className="mt-2">
                    <Badge variant={getPaymentColor(selectedOrder.payment)}>
                      {selectedOrder.payment}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium">Order Items</h3>
                <div className="mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Original Price</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.originalPrice}</TableCell>
                          <TableCell>${item.finalPrice}</TableCell>
                          <TableCell className="text-right">
                            ${item.quantity * item.finalPrice}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-medium"
                        >
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${selectedOrder.totalAmount.total}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-medium"
                        >
                          Tax
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${selectedOrder.totalAmount.tax}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-right font-medium"
                        >
                          Net payable
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${selectedOrder.totalAmount.netAmount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewOrderOpen(false)}
                >
                  Close
                </Button>
                <Button className="bg-black text-white" onClick={(e)=>{
                  UpdateOrderStatus(selectedOrder._id, updateStatus)
                }}>Update Order</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
