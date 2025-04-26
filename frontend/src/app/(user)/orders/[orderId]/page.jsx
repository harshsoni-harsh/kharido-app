"use client";

import { useUserStore } from "@/store/UserStore";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrderDetailsPage({ params }) {
  const { orderId } = params;
  const { user } = useUserStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrder() {
    if (!user?.email) {
      console.error("User is not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("/api/users/get-order", {
        email: user.email,
        orderId: orderId,
      });

      setOrder(response.data); // Assuming the response contains order data
    } catch (error) {
      console.error("Order fetch error", error);
      setError("Failed to fetch order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (orderId && user?.email) {
      fetchOrder();
    }
  }, [orderId, user?.email]); // Run effect when orderId or user changes

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!order) {
    return <p className="text-center text-gray-600">No order found.</p>;
  }

  const { address, items, totalAmount } = order;
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <p className="text-sm text-gray-500">Order ID: {order.id}</p>
        <p className="text-sm text-gray-500">Status: {order.description}</p>
        <p className="text-sm text-gray-500">
          Created At: {new Date(order.createdAt).toLocaleString()}
        </p>
        <a href={order.trackingLink} className="text-blue-600 underline">
          Track your order
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">Shipping Address</h3>
          <p className="text-sm text-gray-500">Name: {address.name}</p>
          <p className="text-sm text-gray-500">Street: {address.street}</p>
          <p className="text-sm text-gray-500">Landmark: {address.landmark}</p>
          <p className="text-sm text-gray-500">City: {address.city}</p>
          <p className="text-sm text-gray-500">State: {address.state}</p>
          <p className="text-sm text-gray-500">Pin Code: {address.pin}</p>
          <p className="text-sm text-gray-500">Phone: {address.phone}</p>
          <hr />

          <h3 className="text-xl font-semibold mt-6">Payment Summary</h3>
          <p className="text-sm text-gray-500">Total: ₹{totalAmount.total}</p>
          <p className="text-sm text-gray-500">Tax: ₹{totalAmount.tax}</p>
          <p className="text-lg font-semibold">
            Net Amount: ₹{totalAmount.netAmount}
          </p>
          <p className="text-sm text-gray-500">
            Payment Mode: {order.paymentMode}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">Order Items</h3>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 py-4 border-b border-gray-200"
            >
              <img
                src={item.product.imageLinks[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1">
                <p className="text-lg font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  {item.product.description}
                </p>
                <p className="text-sm text-gray-500">
                  Price: ₹{item.originalPrice}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  Final Price: ₹{item.finalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
