import { create } from "zustand";
import axios from "axios";

const useCartStore = create((set) => ({
  cart: [],
  totalPrice: 0,

  fetchCart: async () => {
    try {
      const response = await axios.post("http://localhost:3000/users/get-cart", {
        email: "john.doe@example.com",
      });

      const cartItems = response.data.data.items.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.imageLinks?.[0] || "/placeholder.svg",
      }));

      set({
        cart: cartItems,
        totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      });

      console.log("Cart fetched successfully:", cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  },

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        // If the product exists, update it on the server
        axios
          .post("http://localhost:3000/users/update-cart", {
            email: "john.doe@example.com",
            productId: existingProduct.id,
            action: "increment",
          })
          .then((response) => {
            console.log(response.data); // Log response data

            set(() => ({
              cart: response.data.data.items.map((item) => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.imageLinks?.[0] || "/placeholder.svg",
              })),
              totalPrice: response.data.data.items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              ),
            }));
          })
          .catch((error) => {
            console.error("Error updating cart:", error);
          });

        // Optimistic update before API response
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalPrice: state.totalPrice + product.price,
        };
      } else {
        // If it's a new product, add it locally and send an API request
        axios
          .post("http://localhost:3000/users/get-cart", {
            email: "john.doe@example.com",
            productId: product.id,
            action: "add",
          })
          .then((response) => {
            console.log(response.data); // Log response data

            set(() => ({
              cart: response.data.data.items.map((item) => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.imageLinks?.[0] || "/placeholder.svg",
              })),
              totalPrice: response.data.data.items.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
              ),
            }));
          })
          .catch((error) => {
            console.error("Error adding cart item:", error);
          });

        // Optimistic update before API response
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

    axios
      .post("http://localhost:3000/users/update-cart", {
        email: "john.doe@example.com",
        productId: productId,
        action: product.quantity > 1 ? "decrement" : "remove",
      })
      .then((response) => {
        console.log(response.data); // Log response data

        set(() => ({
          cart: response.data.data.items.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.imageLinks?.[0] || "/placeholder.svg",
          })),
          totalPrice: response.data.data.items.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          ),
        }));
      })
      .catch((error) => {
        console.error("Error removing cart item:", error);
      });

    // Optimistic update before API response
    if (product.quantity > 1) {
      return {
        cart: state.cart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        ),
        totalPrice: state.totalPrice - product.price,
      };
    } else {
      return {
        cart: state.cart.filter((item) => item.id !== productId), // Remove product completely
        totalPrice: state.totalPrice - product.price,
      };
    }
  }),
}));
useCartStore.getState().fetchCart();

export default useCartStore;
