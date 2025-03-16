import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],
  totalPrice: 0,

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        // if already exist increase quantity
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalPrice: state.totalPrice + product.price,
        };
      } else {
        // if new product added
        return {
          cart: [...state.cart, { ...product, quantity: 1 }],
          totalPrice: state.totalPrice + product.price,
        };
      }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const product = state.cart.find((item) => item.id === productId);

      if (!product) return state; // If product not found, return state

      if (product.quantity > 1) {
        return {
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          totalPrice: state.totalPrice - product.price,
        };
      } else {
        return {
          cart: state.cart.filter((item) => item.id !== productId), // Remove the product completely
          totalPrice: state.totalPrice - product.price,
        };
      }
    }),
}));

export default useCartStore;
