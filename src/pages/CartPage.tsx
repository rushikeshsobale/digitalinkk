import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { removeFromCart, clearCart, updateQuantity } from "../redux/slices/cartSlice";
import CartSummary from "../components/CartSummery";
export type Offer =
  | { type: "percentage"; value: number }
  | { type: "bogo"; value: number } 
  | { type: "cross"; relatedProductId: string; discount: number }; 
export interface CartItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  offer?: Offer;
}
function isCrossOffer(offer: Offer | undefined): offer is { type: "cross"; relatedProductId: string; discount: number } {
  return offer?.type === "cross";
}
const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.items) as CartItem[];
  const dispatch = useAppDispatch();
  const [expandedDescriptions, setExpandedDescriptions] = useState<string[]>([]);
  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const getPrice = (item: CartItem, cartItems: CartItem[]) => {
    const basePrice = item.price * item.quantity;
    if (!item.offer) return basePrice;
    switch (item.offer.type) {
      case "percentage":
        return basePrice - (basePrice * item.offer.value) / 100;
      case "bogo": {
        const freeItems = Math.floor(item.quantity / (item.offer.value + 1));
        return item.price * (item.quantity - freeItems);
      }
      case "cross": {
        if (isCrossOffer(item.offer)) {
          const crossOffer = item.offer; 
          const related = cartItems.find(
            (x) => x.id === crossOffer.relatedProductId
          );
          if (related) {
            const discountAmount = (related.price * crossOffer.discount) / 100;
            return basePrice + related.price * related.quantity - discountAmount * related.quantity;
          }
        }
        return basePrice;
      }
      default:
        return basePrice;
    }
  };
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="w-full mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => {
              const isDescriptionOpen = expandedDescriptions.includes(item.id);
              const finalPrice = getPrice(item, cartItems);
              return (
                <div
                  key={item.id}
                  className="border p-3 rounded flex flex-col md:flex-row justify-between gap-3"
                >
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    {item.offer?.type === "percentage" && (
                      <p className="text-green-600 text-sm">{item.offer.value}% off!</p>
                    )}
                    {item.offer?.type === "bogo" && (
                      <p className="text-green-600 text-sm">
                        Buy {item.offer.value} get 1 free!
                      </p>
                    )}
                    {isCrossOffer(item.offer) && (
                      <p className="text-green-600 text-sm">
                        Buy this item, get related product {item.offer.discount}% off!
                      </p>
                    )}
                    <div className="flex items-center mt-1 space-x-2">
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, change: -1 }))}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: item.id, change: 1 }))}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-1 font-semibold">₹ {finalPrice}</p>
                    {item.description && (
                      <div className="mt-1">
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-blue-500 underline text-sm"
                        >
                          {isDescriptionOpen ? "Hide description" : "Show description"}
                        </button>
                        {isDescriptionOpen && (
                          <p className="mt-1 text-gray-700 text-sm">{item.description}</p>
                        )}
                      </div>
                    )}
                  </div>

               
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="self-start md:self-center px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => dispatch(clearCart())}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/3 mt-14">
        <CartSummary />
      </div>
    </div>

  );
};
export default CartPage;
