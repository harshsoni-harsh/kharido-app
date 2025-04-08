'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { useUserStore } from "@/store/UserStore"
import useCartStore from "@/store/CartStore"

export default function CheckoutPage() {
  const { user } = useUserStore()
  const { cart, fetchCart } = useCartStore()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const tax = Math.round(total * 0.18)
  const netAmount = total + tax

  useEffect(() => {
    async function fetchAddresses() {
       
      try {
        const res = await axios.post("/api/users/get-meta", {
          email: user?.email,
        })
        setAddresses(res.data.address || [])
      } catch (error) {
        console.error("fetchAddress error:", error)
      }
    }

    if (user?.email) {
      fetchAddresses()
    }
  }, [user?.email,cart])

  async function createOrder() {
    if (!user?.email || !selectedAddress) {
      alert("Please select an address.")
      return
    }

    try {
      const response = await axios.post("/api/users/buy-cart", {
        email: user.email,
        address: selectedAddress,
        paymentMode: "Debit Card",
      })

      alert("Order placed successfully!")
    } catch (error) {
      console.error("Order error:", error)
      alert("Order failed.")
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Select Shipping Address</h2>
        {addresses.length === 0 && <p className="text-gray-500">No saved addresses found.</p>}
        {addresses.map((addr, index) => (
          <label key={index} className="block border p-3 rounded-md mb-2 cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="address"
              value={index}
              onChange={() => setSelectedAddress(addr)}
              className="mr-2"
            />
            {addr.name}, {addr.street}, {addr.city} - {addr.pin}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cart Items */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">Cart Items</h3>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                  <p className="text-sm text-gray-500">Total: ₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Payment Summary</h3>
            <button
              className="text-blue-600 text-sm underline"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              {showBreakdown ? "Hide" : "Show"} Breakdown
            </button>
          </div>

          {showBreakdown && (
            <div className="space-y-2">
              {cart.map((item, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {item.name}: ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                </p>
              ))}
              <hr />
            </div>
          )}

          <p className="text-sm text-gray-500">Subtotal: ₹{total}</p>
          <p className="text-sm text-gray-500">Tax (18%): ₹{tax}</p>
          <p className="text-lg font-semibold">Total: ₹{netAmount}</p>

          <button
            onClick={createOrder}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Pay ₹{netAmount}
          </button>
        </div>
      </div>
    </div>
  )
}
