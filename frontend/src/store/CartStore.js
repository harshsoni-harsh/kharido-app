import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { useUserStore } from "./UserStore";

const useCartStore = create((set, get) => ({
  cart: [],
  totalPrice: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const user = useUserStore.getState().user;
      if (!user) return;

      const { data } = await axios.post("/api/users/get-cart", {
        email: user.email ?? "amit.kumar@example.com",
      });

      const cartItems =
        data?.items?.map((item) => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.imageLinks?.[0] || "/placeholder.svg",
        })) ?? [];

      set({
        cart: cartItems,
        totalPrice: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product) => {
    set({ loading: true });
    const { cart } = get();
    const existingProduct = cart.find((item) => item.id === product.id);

    const user = useUserStore.getState().user;
    if (!user) {
      toast("Please login first");
      return;
    }

    if (existingProduct) {
      try {
        // If the product exists, update it on the server
        const res = await fetch("/api/users/update-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email ?? "amit.kumar@example.com",
            productId: existingProduct.id,
            action: "increment",
          }),
        });

        if (res.ok) {
          const updatedCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );

          set({
            cart: updatedCart,
            totalPrice: updatedCart?.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            ),
          });
          toast.success("Product added successfully");
        }
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("Error adding product");
      } finally {
        set({ loading: false });
      }
    } else {
      // If it's a new product, add it locally and send an API request
      try {
        const res = await fetch("/api/users/update-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email ?? "amit.kumar@example.com",
            productId: product.id,
            action: "add",
          }),
        });

        if (res.ok) {
          const updatedCart = [
            ...cart,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              image: product.imageLinks?.[0] || "/placeholder.svg",
            },
          ];

          set({
            cart: updatedCart,
            totalPrice: updatedCart?.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            ),
          });
          toast.success("Product added successfully");
        }
      } catch (error) {
        console.error("Error adding cart item:", error);
        toast.error("Error adding product");
      } finally {
        set({ loading: false });
      }
    }
  },

  removeFromCart: async (productId) => {
    const { cart } = get();

    const product = cart.find((item) => item.id === productId);
    if (!product) return;

    const user = useUserStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/users/update-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email ?? "amit.kumar@example.com",
          productId: productId,
          action: product.quantity > 1 ? "decrement" : "remove",
        }),
      });

      if (res.ok) {
        const updatedCart =
          product.quantity > 1
            ? cart.map((item) =>
                item.id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              )
            : cart.filter((item) => item.id !== productId);

        set({
          cart: updatedCart,
          totalPrice: updatedCart?.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        });
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error("Error in removing product");
    } finally {
      set({ loading: false });
    }
  },

  deleteFromCart: async (productId) => {
    const { cart } = get();

    const product = cart.find((item) => item.id === productId);
    if (!product) return;

    const user = useUserStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/users/update-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email ?? "amit.kumar@example.com",
          productId: productId,
          action: "remove",
        }),
      });

      if (res.ok) {
        const updatedCart = cart.filter((item) => item.id !== productId);

        set({
          cart: updatedCart,
          totalPrice: updatedCart?.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
        });
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Error in deleting product");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCartStore;
