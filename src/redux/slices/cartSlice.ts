import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";
interface CartState {
  items: CartItem[];
}
export type Offer =
  | { type: "percentage"; value: number }
  | { type: "bogo"; value: number }
  | { type: "cross"; relatedProductId: string; discount: number };

interface RemovePayload {
  id: string;
  offer?: Offer;
  quantity: number;
  products: Product[];

}
const initialState: CartState = {
  items: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex(i => i.id === action.payload.id);
      if (itemIndex > -1) {
        state.items[itemIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    updateCartItem(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateQuantity: (state, action) => {
      const { id, change } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, item.quantity + change);
      }
    },
    removeFromCart: (state, action: { payload: RemovePayload }) => {
      const mainItem = action.payload;
      const removedId = mainItem.id;
      const products: Product[] = action.payload.products;
      state.items = state.items.filter(item => item.id !== removedId);
      state.items = state.items.map(item => {
        if (mainItem.offer?.type === "cross" && item.id === mainItem.offer.relatedProductId) {
          const original = products.find((p: Product) => p.id === item.id);
          if (original) {
            return {
              ...original,
              quantity: item.quantity,
              isOfferApplicable: false,
            };
          }
        }
        return item;
      });

    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});
export const { addToCart, removeFromCart, clearCart, updateQuantity, updateCartItem } = cartSlice.actions;
export default cartSlice.reducer;
