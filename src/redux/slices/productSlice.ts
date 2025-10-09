import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types";


const initialState: Product[] = [
  {
    id: "1",
    name: "Bread",
    description: "Freshly baked whole wheat bread, perfect for sandwiches and toast.",
    price: 50,
    offer: { type: "percentage", value: 10 },
    isOfferApplicable: false,
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

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateProduct: (state, action) => {
        const index = state.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
         
          state[index] = {
            ...state[index],
            ...action.payload,
          };
        }
      },
      resetProducts: (state) => {
        return [...initialState]; 
      },
  },
});

export const { updateProduct, resetProducts } = productSlice.actions;
export default productSlice.reducer;
