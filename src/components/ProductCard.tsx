import React, { useState } from "react";
import { Product } from "../types";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/slices/cartSlice";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);

  const addItemToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
        appliedOffer: product.offer,
      })
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        <h2
          className="font-extrabold text-xl text-gray-900 truncate"
          title={product.name}
        >
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <p className="text-2xl font-bold text-indigo-600 mt-3 border-t pt-3">
          ₹ {product.price.toFixed(2)}
        </p>
        {product.offer && (
          <p className="mt-2 text-green-600 text-sm">
            {product.offer.type === "percentage" &&
              `${product.offer.value}% off`}
            {product.offer.type === "bogo" &&
              `Buy ${product.offer.value} get 1 free`}
            {product.offer.type === "cross" &&
              `Get ${product.offer.discount}% off on related product`}
          </p>
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
            className="flex-1 text-sm px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add 
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
