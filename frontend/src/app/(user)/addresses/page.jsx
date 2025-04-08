"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/store/UserStore";
import { useEffect } from "react";
import axios from "axios";

const initialAddresses = [
  {
    _id: "67f56b1f31586ea6cc70f485",
    name: "Rahul Sharma",
    street: "12, Green Park Apartments",
    landmark: "Near Metro Station",
    pin: 110016,
    state: "Delhi",
    city: "New Delhi",
    phone: "9876543210",
  },
  {
    _id: "67f56b1f31586ea6cc70f486",
    name: "Rahul Sharma (Work)",
    street: "34, Cyber City",
    pin: 122002,
    state: "Haryana",
    city: "Gurugram",
    phone: "9876543211",
  },
];

export default function YourAddresses() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { user, fetchUser } = useUserStore();
  useEffect(() => {
    
    fetchAddresses();
  }, [user]);

  async function fetchAddresses() {
    try{
        const res = await axios.post("/api/users/get-meta", {
            email: user?.email,
          });
      
          setAddresses(res.data.address);
    }
    catch(error){
        console.log("fetchAddress error: ",error)
    }
    
  }
  const handleEditChange = (e) => {
    setEditingAddress({ ...editingAddress, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try{
        const newAddress = { ...editingAddress };
        const res = await axios.post("/api/users/update-address", {
          email: user?.email,
          action: "update",
          address: newAddress,
        });
        console.log(res.data);
        alert(res.status);
        fetchAddresses();
        setShowCreateDialog(false);
        setShowEditDialog(false);
    }
    catch(error){
        console.log("Edit Address error: ", error)
    }
   
  };

  const handleCreate = async () => {
    try{
        const newAddress = { ...editingAddress };
        const res = await axios.post("/api/users/update-address", {
          email: user?.email,
          action: "create",
          address: newAddress,
        });
        console.log(res.data);
        alert(res.status);
        fetchAddresses();
        setShowCreateDialog(false);
    }
    catch(error){
        console.log("Create address error: ", error)
    }
   
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Addresses</h1>
      <div className="grid gap-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="border rounded-2xl p-4 shadow-sm flex justify-between items-start"
          >
            <div>
              <p className="font-medium">{addr.name}</p>
              <p>{addr.street}</p>
              {addr.landmark && <p>{addr.landmark}</p>}
              <p>
                {addr.city}, {addr.state} - {addr.pin}
              </p>
              <p>Phone: {addr.phone}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setEditingAddress(addr);
                setShowEditDialog(true);
              }}
            >
              Edit Address
            </Button>
          </div>
        ))}

        <Button
          className="w-fit"
          onClick={() => {
            setEditingAddress({
              name: "",
              street: "",
              landmark: "",
              pin: "",
              state: "",
              city: "",
              phone: "",
            });
            setShowCreateDialog(true);
          }}
        >
          Add New Address
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="grid gap-3">
              {Object.keys(editingAddress).map(
                (key) =>
                  key !== "_id" && (
                    <div key={key}>
                      <Label htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={key}
                        name={key}
                        value={editingAddress[key]}
                        onChange={handleEditChange}
                      />
                    </div>
                  )
              )}
              <Button onClick={handleEditSave}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <div className="grid gap-3">
              {Object.keys(editingAddress).map((key) => (
                <div key={key}>
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    value={editingAddress[key]}
                    required
                    onChange={handleEditChange}
                  />
                </div>
              ))}
              <Button onClick={handleCreate}>Create Address</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
