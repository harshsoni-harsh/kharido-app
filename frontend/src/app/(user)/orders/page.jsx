"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setError(null);
        if (!user) return;
        const response = await axios.post("/api/users/get-all-orders", {
          email: user?.email,
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders", err);
        // setError("Failed to fetch orders.")
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!orders.length) {
    return <p className="text-center text-gray-600">No orders found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">Your Orders</h1>

      {/* Grid for all orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-lg p-6 space-y-4"
          >
            {/* Order ID & Description */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-900">
                Order ID: {order.id}
              </p>
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <hr />
            <p className="text-sm text-gray-500">{order.description}</p>

            {/* Address */}
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                <strong>Shipping to:</strong>
                <br /> {order.address.name}
              </p>
              <p>
                {order.address.street}, {order.address.city},{" "}
                {order.address.state}, {order.address.pin}
              </p>
              <p>Phone: {order.address.phone}</p>
            </div>

            {/* Order Status */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-800">Status:</h3>
              <ul className="space-y-1">
                {order.status.map((status, index) => (
                  <li key={index} className="text-sm text-gray-500">
                    {status.property} - {new Date(status.time).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
            <hr />

            {/* Payment and Total */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Payment Mode: {order.paymentMode}
              </p>
              <p className="text-sm text-gray-500">
                <b>Total: ₹ {order.totalAmount.netAmount}</b>
              </p>
            </div>

            {/* Tracking Link */}
            <div className="flex flex-row justify-between">
              <a
                href={order.trackingLink}
                className="text-blue-600 underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Track Order
              </a>
              <Button onClick={() => router.push(`/orders/${order._id}`)}>
                {" "}
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
