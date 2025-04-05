"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, Filter, MoreHorizontal, Search, Shield, User } from "lucide-react"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { useEffect } from "react"

// Sample user data
const users = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
    orders: 12,
    joined: "2023-01-15",
    lastLogin: "2023-08-14",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Customer",
    status: "Active",
    orders: 8,
    joined: "2023-02-20",
    lastLogin: "2023-08-13",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Admin",
    status: "Active",
    orders: 0,
    joined: "2022-11-05",
    lastLogin: "2023-08-15",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Customer",
    status: "Inactive",
    orders: 3,
    joined: "2023-03-10",
    lastLogin: "2023-07-22",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    role: "Customer",
    status: "Blocked",
    orders: 1,
    joined: "2023-04-18",
    lastLogin: "2023-06-30",
  },
]

export default function UsersPage() {
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const[userList, setUserList]= useState([])

  useEffect(()=>{
    getUsers()

  },[])

  async function getUsers(startIndex=0, endIndex=8) {

    const res = await axios.post("/api/admin/users/range",{
      startIndex:0,
      endIndex: 6
    })
    console.log(res)
    setUserList(res.data.data)
    
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Blocked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
            <CardTitle className="text-lg">User Management</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-zinc-100 text-gray-400">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black">All Users</TabsTrigger>
              {/* <TabsTrigger value="customers" className="data-[state=active]:bg-white data-[state=active]:text-black">Customers</TabsTrigger>
              <TabsTrigger value="admins" className="data-[state=active]:bg-white data-[state=active]:text-black">Admins</TabsTrigger>
              <TabsTrigger value="blocked" className="data-[state=active]:bg-white data-[state=active]:text-black">Blocked</TabsTrigger> */}
            </TabsList>
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Role</TableHead>
                    
                    <TableHead>
                      <div className="flex items-center">
                        Orders
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Reviews
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {user.role === "admin" ? (
                            <Shield className="mr-2 h-4 w-4 text-blue-500" />
                          ) : (
                            <User className="mr-2 h-4 w-4 text-gray-500" />
                          )}
                          {user.role}
                        </div>
                      </TableCell>
                     
                      <TableCell>{user.orders.length}</TableCell>
                      <TableCell>{user.reviews.length}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit User</DropdownMenuItem>
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            {user.role === "Customer" ? (
                              <DropdownMenuItem>Promote to Admin</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Demote to Customer</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {user.status === "Active" ? (
                              <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                            ) : user.status === "Blocked" ? (
                              <DropdownMenuItem className="text-green-600">Unblock User</DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" defaultValue={selectedUser.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" defaultValue={selectedUser.email} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select defaultValue={selectedUser.role.toLowerCase()}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedUser.status.toLowerCase()}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditUserOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

