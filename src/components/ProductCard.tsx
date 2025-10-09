import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";
import { updateProduct } from "../redux/slices/productSlice";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // ✅ Get the products list from Redux
  const products = useAppSelector((state) => state.products);

  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const isInCart = cartItems.some((item) => item.id === product.id);

  const addItemToCart = () => {
    if (!isInCart) {
      dispatch(addToCart({ ...product, quantity }));
      setAdded(true);

      // ✅ Handle cross-offers
      if (product.offer?.type === "cross") {
        const crossOffer = product.offer as { type: "cross"; relatedProductId: string; discount: number };

        // ✅ Type the callback to Product
        const relatedProduct = products.find(
          (p: Product) => p.id === crossOffer.relatedProductId
        );

        if (relatedProduct) {
          dispatch(
            updateProduct({ ...relatedProduct, isOfferApplicable: true })
          );
        }
      }
    }
  };

  // Reset added state if removed from cart
  useEffect(() => {
    if (!isInCart) setAdded(false);
  }, [isInCart]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        <h2 className="font-extrabold text-xl text-gray-900 truncate" title={product.name}>
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <p className="text-2xl font-bold text-indigo-600 mt-3 border-t pt-3">₹ {product.price.toFixed(2)}</p>
        {product.offer && (
          <p className="mt-2 text-green-600 text-sm">
            {product.offer.type === "percentage" && (
              <>{product.isOfferApplicable ? "50% off" : `${product.offer.value}% off`}</>
            )}
            {product.offer.type === "bogo" && `Buy ${product.offer.value} get 1 free`}
            {product.offer.type === "cross" && `Get ${product.offer.discount}% off on related product`}
          </p>
        )}
        {product.isOfferApplicable && (
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
            Offer Available
          </span>
        )}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="w-10 text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
          <button
            onClick={addItemToCart}
            disabled={isInCart}
            className={`flex-1 text-sm px-5 py-2 font-semibold rounded-lg shadow-md transition-transform duration-200 transform
              ${isInCart || added
                ? "bg-green-500 hover:bg-green-600"
                : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {isInCart || added ? "Added ✔️" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
