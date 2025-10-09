import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { removeFromCart, clearCart, updateQuantity, addToCart, updateCartItem } from "../redux/slices/cartSlice";
import { updateProduct,resetProducts} from "../redux/slices/productSlice";
import CartSummary from "../components/CartSummery";
import { CartItem } from "../types";
import { Product } from "../types";
export type Offer =
  | { type: "percentage"; value: number }
  | { type: "bogo"; value: number }
  | { type: "cross"; relatedProductId: string; discount: number };

function isCrossOffer(offer: Offer | undefined): offer is { type: "cross"; relatedProductId: string; discount: number } {
  return offer?.type === "cross";
}
const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.items) as CartItem[];
  const products = useAppSelector((state) => state.products);
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
            const discountAmount = related.price * 0.5 * related.quantity;
            return basePrice + related.price * related.quantity - discountAmount;
          }
        }
        return basePrice;
      }
      default:
        return basePrice;
    }
  };
  useEffect(() => {
    const applyCrossOffers = () => {
      cartItems.forEach(item => {
        if (item.offer?.type === "cross" && item.offer.relatedProductId) {
          console.log(item, 'item')
          let offer = item.offer
          const relatedItem = cartItems.find(
            x => x.id === offer.relatedProductId
          );
          if (relatedItem?.offer?.type === "percentage" && relatedItem.offer.value !== 50) {
            const updatedOffer = { ...relatedItem.offer, value: 50 };
            const updatedItem: CartItem = {
              ...relatedItem,
              offer: updatedOffer,
              description: relatedItem.description || "",
              appliedOffer: offer,
            };

            dispatch(updateCartItem(updatedItem));
          }
        }
      });
    };
    applyCrossOffers();
  }, [cartItems, dispatch]);

  const handleRemove = (i: any) => {
    // 1️⃣ Remove from cart
    const item = {...i, products}
    dispatch(removeFromCart(item ));
  
    // 2️⃣ Reset related product if cross-offer
    if (i.offer?.type === "cross" && i.offer.relatedProductId) {
      const offer = i.offer
      const relatedProduct = products.find(p => p.id === offer.relatedProductId);
      if (relatedProduct) {
        dispatch(updateProduct({ ...relatedProduct, isOfferApplicable: false }));
      }
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    dispatch(resetProducts()); // reset all products to original state
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
                    <h1>{item.name}</h1>
                    {item.offer?.type === "percentage" && (
                      <div className="flex flex-col space-y-1">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                          {item.offer.value}% OFF
                        </span>
                        {item.appliedOffer && (
                          <span className="inline-block bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-md">
                            Offer Applied
                          </span>
                        )}
                      </div>

                    )}
                    {item.offer?.type === "bogo" && (
                      <div>
                        <p className="text-green-600 text-sm">
                          Buy {item.offer.value} get 1 free!
                        </p>
                        <p className=" bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-md">
                          Offer Applied
                        </p>
                      </div>
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
                    onClick={() =>
                      handleRemove(item)
                    }
                    className="self-start md:self-center px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <button
              onClick={() =>handleClearCart() }
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
