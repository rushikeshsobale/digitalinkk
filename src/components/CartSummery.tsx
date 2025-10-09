import React from "react";
import { useAppSelector } from "../redux/hooks";
import { CartItem, Offer } from "../types";
import { useNavigate } from "react-router-dom";
const isCrossOffer = (
  offer?: Offer
): offer is { type: "cross"; relatedProductId: string; discount: number } =>
  offer?.type === "cross";
const CartSummary = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const getItemDiscount = (item: CartItem) => {
    const offer = item.offer;
    if (!offer) return 0;
    switch (offer.type) {
      case "percentage":
        return (item.price * item.quantity * offer.value) / 100;
      case "bogo":
        const freeItems = Math.floor(item.quantity / (offer.value + 1));
        return freeItems * item.price;
      case "cross":
        return 0;
      default:
        return 0;
    }
  };
  const getOfferText = (item: CartItem) => {
    const offer = item.offer;
    if (!offer) return null;

    switch (offer.type) {
      case "percentage":
        return `Discount: ${offer.value}% off`;
      case "bogo":
        return `get ${offer.value + 1}, pay for ${offer.value}`;
      case "cross":
        if (isCrossOffer(offer)) {
          return `${offer.discount}% off on related product`;
        }
        return null;
      default:
        return "No offers";
    }
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((sum, item) => sum + getItemDiscount(item), 0);
  const total = subtotal - totalDiscount;
  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full md:w-80">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="flex flex-col space-y-3">
        {cartItems.map((item) => {
          const discount = getItemDiscount(item);
          const originalPrice = item.price * item.quantity;
          const discountedPrice = originalPrice - discount;
          return (
            <div key={item.id} className="flex flex-col border-b border-gray-200 pb-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.name} x {item.quantity}</span>
                <div className="text-right">
                  {item.offer?.type === "percentage" && item.offer &&
                    <span className="text-gray-400 line-through mr-2">
                      ₹ {originalPrice.toFixed(2)}
                    </span>}
                  <span className="font-semibold text-indigo-600">
                    ₹ {discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              {item.offer && (
                <div className="text-sm text-green-600 mt-1">
                  {getOfferText(item)}
                </div>
              )}
            </div>
          );
        })}
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

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total:</span>
        <span>₹ {total.toFixed(2)}</span>
      </div>

      <button
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        onClick={() => navigate("/digitalinkk/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
