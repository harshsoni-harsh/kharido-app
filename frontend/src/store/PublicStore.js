import { create } from "zustand";
import axios from "axios";

const usePublicStore = create((set, get) => ({
  categories: [],
  products: {},
  loading: false,

  fetchCategories: async function () {
    set({ loading: true });
    try {
      const res = await axios.post(`/api/public/get-categories`, {});
      const categories = res.data.data.categories;
      set({ categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    set({ loading: false });
  },

  fetchAllProducts: async function () {
    set({ loading: true });
    const { categories, fetchProducts } = get();
    await Promise.all(
      categories.map(async (category) => await fetchProducts(category._id))
    );
    set({ loading: false });
  },

  fetchProducts: async (categoryId) => {
    try {
      const res = await axios.post(`/api/public/get-category-products`, {
        categoryId: categoryId,
      });

      set((state) => ({
        products: {
          ...state.products,
          [categoryId]: res.data.data.products,
        },
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  },
}));

export default usePublicStore;
