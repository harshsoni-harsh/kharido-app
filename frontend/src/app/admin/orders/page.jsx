"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, Eye, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample order data
const orders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    email: "john@example.com",
    date: "2023-08-15",
    total: 78.99,
    status: "Delivered",
    payment: "Completed",
    items: [
      { name: "Organic Apples", quantity: 2, price: 3.99 },
      { name: "Fresh Milk", quantity: 1, price: 2.49 },
      { name: "Whole Wheat Bread", quantity: 2, price: 3.29 },
    ],
    address: "123 Main St, Anytown, CA 12345",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2023-08-14",
    total: 45.5,
    status: "Shipped",
    payment: "Completed",
    items: [
      { name: "Free Range Eggs", quantity: 1, price: 4.99 },
      { name: "Organic Spinach", quantity: 2, price: 2.99 },
    ],
    address: "456 Oak Ave, Somewhere, NY 54321",
  },
  {
    id: "ORD-003",
    customer: "Michael Brown",
    email: "michael@example.com",
    date: "2023-08-14",
    total: 32.97,
    status: "Processing",
    payment: "Pending",
    items: [
      { name: "Chicken Breast", quantity: 1, price: 8.99 },
      { name: "Atlantic Salmon", quantity: 1, price: 12.99 },
      { name: "Avocados", quantity: 2, price: 1.99 },
    ],
    address: "789 Pine Rd, Elsewhere, TX 67890",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    date: "2023-08-13",
    total: 56.75,
    status: "Delivered",
    payment: "Completed",
    items: [
      { name: "Organic Apples", quantity: 3, price: 3.99 },
      { name: "Fresh Milk", quantity: 2, price: 2.49 },
    ],
    address: "321 Elm St, Nowhere, WA 13579",
  },
  {
    id: "ORD-005",
    customer: "David Wilson",
    email: "david@example.com",
    date: "2023-08-13",
    total: 29.99,
    status: "Cancelled",
    payment: "Refunded",
    items: [
      { name: "Whole Wheat Bread", quantity: 1, price: 3.29 },
      { name: "Free Range Eggs", quantity: 2, price: 4.99 },
    ],
    address: "654 Maple Dr, Anywhere, FL 97531",
  },
]

export default function order() {
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsViewOrderOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "default"
      case "Shipped":
        return "info"
      case "Processing":
        return "warning"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "Completed":
        return "default"
      case "Pending":
        return "warning"
      case "Refunded":
        return "destructive"
      default:
        return "secondary"
    }
  }

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
            <DropdownMenuContent className='bg-white'>
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
              <Input placeholder="Search orders..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-zinc-200">
              <TabsTrigger value="all" className='data-[state=active]:bg-white'>All Orders</TabsTrigger>
              <TabsTrigger value="processing" className='data-[state=active]:bg-white'>Processing</TabsTrigger>
              <TabsTrigger value="shipped" className='data-[state=active]:bg-white'>Shipped</TabsTrigger>
              <TabsTrigger value="delivered" className='data-[state=active]:bg-white'>Delivered</TabsTrigger>
              <TabsTrigger value="cancelled" className='data-[state=active]:bg-white'>Cancelled</TabsTrigger>
            </TabsList>
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
                        Customer
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
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)} 
                        className={`${order.status === "Delivered"
                            ? "bg-green-500 text-white" 
                            : order.status === 'Cancelled' 
                            ? "bg-red-500 text-white"
                            : "bg-white text-black"
                        }`}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPaymentColor(order.payment)}
                        className={`${order.payment === 'Completed'
                            ? "bg-green-500 text-white"
                            : order.payment === 'pending'
                            ? "bg-white text-black"
                            : "bg-red-500 text-white"
                        }`}

                        >{order.payment}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)} >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuItem>Process Refund</DropdownMenuItem>
                              <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="processing">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders
                    .filter((order) => order.status === "Processing")
                    .map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPaymentColor(order.payment)}>{order.payment}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
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
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuItem>Process Refund</DropdownMenuItem>
                                <DropdownMenuItem>Send Invoice</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
            {/* Similar content for other tabs */}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white ">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>{selectedOrder && `Order ID: ${selectedOrder.id}`}</DialogDescription>
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
                  <div className="mt-2">
                    <Select defaultValue={selectedOrder.status.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Badge variant={getPaymentColor(selectedOrder.payment)}>{selectedOrder.payment}</Badge>
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
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right font-medium">${selectedOrder.total.toFixed(2)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsViewOrderOpen(false)}>
                  Close
                </Button>
                <Button>Update Order</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

