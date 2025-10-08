// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { CartItem } from "../types";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import CartSummary from "../components/CartSummery";
const CheckoutPage= () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handlePlaceOrder = async () => {
    if (!name || !email || !address) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const cleanItems = cartItems.map(item => {
        const cleaned: Record<string, any> = {};
        Object.entries(item).forEach(([key, value]) => {
          if (value !== undefined) cleaned[key] = value;
        });
        return cleaned;
      });
  
      await addDoc(collection(db, "orders"), {
        name,
        email,
        address,
        items: cleanItems,
        createdAt: serverTimestamp(),
      });
  
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Error placing order. Try again!");
    } finally {
      setLoading(false);
    }
  };
  

  if (success) {
    return (
      <div className="p-5 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">Order Placed Successfully!</h2>
        <p>Thank you for your purchase, {name}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-5 flex flex-col md:flex-row gap-6">
     
      <div className="flex-1 bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 rounded"
            rows={4}
          />
          <button
            onClick={handlePlaceOrder}
            disabled={loading || cartItems.length === 0}
            className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
      <div className="w-full md:w-80">
        <CartSummary />
      </div>
    </div>
  );
};

export default CheckoutPage;
