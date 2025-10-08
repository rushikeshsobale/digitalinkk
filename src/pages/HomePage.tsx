import React from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";
const products: Product[] = [
  {
    id: "1",
    name: "Bread",
    description: "Freshly baked whole wheat bread, perfect for sandwiches and toast.",
    price: 50,
    offer: { type: "percentage", value: 10 },
  },
  {
    id: "2",
    name: "Milk",
    description: "High-fat buffalo milk, rich in calcium and essential nutrients, 1L pack.",
    price: 60,
  },
  {
    id: "3",
    name: "Cheese",
    description: "Low-fat toned cheese, ideal for cooking and snacking, 1L equivalent.",
    price: 45,
    offer: { type: "bogo", value: 1 },
  },
  {
    id: "4",
    name: "Soup",
    description: "Delicious vegetable soup, ready-to-eat, full of vitamins and flavor.",
    price: 80,
    offer: { type: "cross", relatedProductId: "1", discount: 50 },
  },
  {
    id: "5",
    name: "Butter",
    description: "Creamy unsalted butter, perfect for baking and spreading.",
    price: 100,
    offer: { type: "percentage", value: 15 },
  },
];
const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Milk Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
