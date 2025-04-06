"use client";

import {
  Card,
  CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import {
  ChartContainer
} from "@/components/ui/chart";
import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users
} from "lucide-react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const dummyLast10MonthRevenue = [
  { month: "June", total: 119950 },
  { month: "July", total: 126600 },
  { month: "August", total: 120400 },
  { month: "September", total: 137800 },
  { month: "October", total: 129000 },
  { month: "November", total: 142300 },
  { month: "December", total: 110750 },
  { month: "January", total: 134200 },
  { month: "February", total: 118500 },
  { month: "March", total: 125000 },
];

export default function Page() {
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalProductLastMonth, setTotalProductLastMonthCount] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(2341);
  const [last10MonthsRevenue, setLast10MonthRevenue] = useState(
    dummyLast10MonthRevenue
  );

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    getLastMonthRevenue();
    getOrderCount();
    getRecentOrders();
    getTotalProductsSold();
    getTotalUsers();
    getLast10MonthsRevenue();
  }, []);

  async function getTotalUsers() {
    try {
      const res = await axios.get("api/admin/analytics/total-users");
      console.log("total users", res);
      setTotalUsers(res.data || 2341);
    } catch (e) {}
  }
  async function getTotalProductsSold() {
    const startDate = new Date();
    const endDate = new Date();
    // startDate.setMonth(startDate.getMonth() - 1);
    startDate.setFullYear(2000);
    const res = await axios.post("api/admin/analytics/products-sold", {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
    console.log("total product sold", res.data);
    setTotalProductLastMonthCount(res.data.count);
  }

  async function getRecentOrders() {
    const res = await axios.post("/api/admin/orders/recent", {
      count: 5,
    });
    console.log(res.data);
    setRecentOrders(res.data.orders);
  }

  async function getOrderCount() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(2000);
    // startDate.setMonth(startDate.getMonth() - 1);

    const res = await axios.post("/api/admin/orders/interval", {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
    console.log("order count", res.data);
    setTotalOrderCount(res.data.totalCount);
  }

  async function getLast10MonthsRevenue() {
    const revenues = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (let i = 10; i > 0; i--) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() - (i - 1));
      endDate.setDate(1);

      const startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 1);

      const res = await axios.post("/api/admin/analytics/revenue", {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      const monthIndex = startDate.getMonth();
      const monthName = monthNames[monthIndex];

      revenues.push({
        month: monthName,
        total: res.data.revenue || 0,
      });
    }

    return revenues;
  }

  async function getLastMonthRevenue() {
    const endDate = new Date();
    const startDate = new Date();
    // startDate.setMonth(startDate.getMonth() - 1);
    startDate.setFullYear(2000);
    const res = await axios.post("/api/admin/analytics/revenue", {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    });
    console.log("Last month revenue", res.data);
    setLastMonthRevenue(res.data.revenue);
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your grocery store</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {" "}
              ₹ {lastMonthRevenue ? lastMonthRevenue.toFixed(2) : "45,231.89"}
            </div>
            {/* <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                +20.1%
              </span>{" "}
              from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrderCount}</div>
            {/* <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                +12.2%
              </span>{" "}
              from last month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products Sold Last Month
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductLastMonth}</div>
            {/* <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                +8.4%
              </span>{" "}
              new products this month
            </p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            {/* <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDownIcon className="mr-1 h-4 w-4" />
                -4.5%
              </span>{" "}
              from last month
            </p> */}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {/* <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={[
                      { name: "Jan", total: 1500 },
                      { name: "Feb", total: 2300 },
                      { name: "Mar", total: 3200 },
                      { name: "Apr", total: 4500 },
                      { name: "May", total: 4200 },
                      { name: "Jun", total: 5000 },
                      { name: "Jul", total: 6100 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer> */}
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <BarChart
                    width={600}
                    height={300}
                    data={
                      last10MonthsRevenue.length
                        ? last10MonthsRevenue
                        : dummyLast10MonthRevenue
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      fill="var(--color-desktop)"
                      radius={4}
                      barSize={20} // Slimmer bars (default is ~30)
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                {/* <CardDescription>
              
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentOrders.map((i, idx) => (
                    <div className="flex items-center" key={idx}>
                      <div className="h-9 w-9 rounded-full bg-primary/10"></div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Customer {idx + 1}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {i.email}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        ₹ {i.totalAmount.netAmount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
