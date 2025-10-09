import React from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types"; 
import { useAppSelector } from "../redux/hooks";
const HomePage = () => {
  const products = useAppSelector((state) => state.products);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Milk Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
