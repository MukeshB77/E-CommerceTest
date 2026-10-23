import { createSlice } from '@reduxjs/toolkit';

const initialState = { items: [] };
// Cart item shape: { id, title, price, image, category, quantity }

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      const quantityToAdd = Math.max(1, Number(product.quantity) || 1);
      if (existing) {
        existing.quantity += quantityToAdd;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: quantityToAdd,
        });
      }
    },
    increase(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrease(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increase, decrease, removeFromCart, clearCart } = cartSlice.actions;

export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;