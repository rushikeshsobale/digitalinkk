// src/components/CartSummary.tsx
import React from "react";
import { useAppSelector } from "../redux/hooks";
import { CartItem, Offer } from "../types";
import {  useNavigate } from "react-router-dom";
// ----------------------
// Type guard for cross offers
const isCrossOffer = (
  offer?: Offer
): offer is { type: "cross"; relatedProductId: string; discount: number } =>
  offer?.type === "cross";
// ----------------------

const CartSummary = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
const navigate = useNavigate()
  // Function to calculate discount for each item
  const getItemDiscount = (item: CartItem) => {
    const offer = item.offer;
    if (!offer) return 0;

    switch (offer.type) {
      case "percentage":
        return (item.price * item.quantity * offer.value) / 100;

      case "bogo":
        // Buy X get 1 free
        const freeItems = Math.floor(item.quantity / (offer.value + 1));
        return freeItems * item.price;

      case "cross":
        // Cross product discount
        if (isCrossOffer(offer)) {
          const related = cartItems.find(
            (x) => x.id === offer.relatedProductId
          );
          if (related) {
            return (related.price * related.quantity * offer.discount) / 100;
          }
        }
        return 0;

      default:
        return 0;
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + getItemDiscount(item),
    0
  );
  const total = subtotal - totalDiscount;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full md:w-80">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="flex flex-col space-y-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>
              ₹ {(item.price * item.quantity - getItemDiscount(item)).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 my-3"></div>

      <div className="flex justify-between mb-2">
        <span>Subtotal:</span>
        <span>₹ {subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between mb-2 text-green-600">
        <span>You Saved:</span>
        <span>- ₹ {totalDiscount.toFixed(2)}</span>
      </div>

      <div className="border-t border-gray-300 my-2"></div>

      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>₹ {total.toFixed(2)}</span>
      </div>

      <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"  onClick={() => navigate("/checkout")}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
