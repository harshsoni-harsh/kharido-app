"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowUpDown, ChevronDown, Download, Eye, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
import Loader from "@/components/Loader";

export default function Order() {
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalorder, setTotalOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const res = await axios.post("/api/admin/orders/range", {
          startIndex: 0,
          endIndex: 50,
        });
        setTotalOrder(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrder = useMemo(() => {
    if (!searchQuery) return totalorder;

    return totalorder.filter((order) => {
      const query = searchQuery.toLowerCase();
      return (
        (order._id?.toLowerCase() || "").includes(query) ||
        (order.email?.toLowerCase() || "").includes(query) ||
        (order.paymentMode?.toLowerCase() || "").includes(query) ||
        (order.totalAmount?.netAmount?.toString() || "").includes(query) ||
        (order.createdAt
          ? new Date(order.createdAt).toLocaleDateString().toLowerCase()
          : ""
        ).includes(query) ||
        order.status?.at(-1)?.property?.toLowerCase().includes(query)
      );
    });
  }, [totalorder, searchQuery]);

  const ordersByStatus = useMemo(
    () => ({
      processing: totalorder.filter(
        (order) =>
          order.status?.at(-1)?.property?.toLowerCase() === "processing"
      ),
      shipped: totalorder.filter(
        (order) => order.status?.at(-1)?.property?.toLowerCase() === "shipped"
      ),
      delivered: totalorder.filter(
        (order) => order.status?.at(-1)?.property?.toLowerCase() === "delivered"
      ),
      cancelled: totalorder.filter(
        (order) => order.status?.at(-1)?.property?.toLowerCase() === "cancelled"
      ),
    }),
    [totalorder]
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status?.at(-1)?.property?.toLowerCase() || "");
    setIsViewOrderOpen(true);
  };

  const getStatusColor = (status) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case "delivered":
        return "default";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentColor = (payment) => {
    if (!payment) return "secondary";
    switch (payment.toLowerCase()) {
      case "success":
        return "default";
      case "pending":
        return "warning";
      case "refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  async function updateOrderStatus(orderId, status) {
    if (!orderId || !status) return;

    try {
      setIsUpdating(true);
      const res = await axios.post("/api/admin/orders/update", {
        orderId,
        status: status.charAt(0).toUpperCase() + status.slice(1),
      });

      if (res.data.success) {
        toast.success("Order status updated");
        // Refresh orders
        const refreshRes = await axios.post("/api/admin/orders/range", {
          startIndex: 0,
          endIndex: 50,
        });
        setTotalOrder(refreshRes.data.orders || []);
        setIsViewOrderOpen(false);
      } else {
        toast.error(res.data.message || "Failed to update order");
      }
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error("Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) return <Loader />;

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
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Order Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* All Orders Tab */}
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
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrder.length > 0 ? (
                    filteredOrder.map((order) => (
                      <TableRow key={order._id || `order-${Math.random()}`}>
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
                          ₹{order.totalAmount?.netAmount?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(
                              order.status?.at(-1)?.property
                            )}
                            className="capitalize"
                          >
                            {order.status?.at(-1)?.property || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPaymentColor(order.paymentMode)}
                            className="capitalize"
                          >
                            {order.paymentMode || "Unknown"}
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
                              <DropdownMenuContent
                                align="end"
                                className="bg-white"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order._id, "cancelled")
                                  }
                                  className="text-red-600"
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            {/* Status-specific tabs */}
            {["processing", "shipped", "delivered", "cancelled"].map(
              (status) => (
                <TabsContent key={status} value={status}>
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
                      {ordersByStatus[status].length > 0 ? (
                        ordersByStatus[status].map((order) => (
                          <TableRow key={order._id || `order-${Math.random()}`}>
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
                              ₹
                              {order.totalAmount?.netAmount?.toFixed(2) ||
                                "0.00"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusColor(
                                  order.status?.at(-1)?.property
                                )}
                                className="capitalize"
                              >
                                {order.status?.at(-1)?.property || "Unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getPaymentColor(order.paymentMode)}
                                className="capitalize"
                              >
                                {order.paymentMode || "Unknown"}
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
                                {status !== "cancelled" && (
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
                                      <DropdownMenuItem className="text-red-600">
                                        Cancel Order
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No {status} orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order ID: {selectedOrder._id || "N/A"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">
                      Customer Information
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className="font-medium">
                        {selectedOrder.shippingAddress?.name || "N/A"}
                      </p>
                      <p>{selectedOrder.email || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Shipping Address</h3>
                    <p className="mt-2 text-sm">
                      {selectedOrder.shippingAddress?.address || "N/A"},{" "}
                      {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                      {selectedOrder.shippingAddress?.state || "N/A"},{" "}
                      {selectedOrder.shippingAddress?.postalCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Order Status</h3>
                    <div className="mt-2">
                      <Select
                        value={updateStatus}
                        onValueChange={setUpdateStatus}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="processing">Processing</SelectItem>
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
                      <Badge
                        variant={getPaymentColor(selectedOrder.paymentStatus)}
                      >
                        {selectedOrder.paymentStatus || "N/A"}
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
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product?.name || "N/A"}</TableCell>
                            <TableCell>{item.quantity || 0}</TableCell>
                            <TableCell>
                              ₹{item.price?.toFixed(2) || "0.00"}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹
                              {(
                                (item.price || 0) * (item.quantity || 0)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-right font-medium"
                          >
                            Subtotal
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹
                            {selectedOrder.totalAmount?.subtotal?.toFixed(2) ||
                              "0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-right font-medium"
                          >
                            Shipping
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹
                            {selectedOrder.totalAmount?.shipping?.toFixed(2) ||
                              "0.00"}
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
                            ₹
                            {selectedOrder.totalAmount?.tax?.toFixed(2) ||
                              "0.00"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-right font-medium"
                          >
                            Total
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₹
                            {selectedOrder.totalAmount?.total?.toFixed(2) ||
                              "0.00"}
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
                  <Button
                    className="bg-black text-white"
                    onClick={() =>
                      updateOrderStatus(selectedOrder._id, updateStatus)
                    }
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Order"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
