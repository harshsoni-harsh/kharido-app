import { create } from "zustand";
import axios from "axios";

const usePublicStore = create((set, get) => ({
  categories: [],
  products: {},

  fetchCategories: async function () {
    try {
      const res = await axios.post(`/api/public/get-categories`, {});
      const categories = res.data.data.categories;
      set({ categories });
    } catch (error) {
      //   console.error("Error fetching categories:", error);
    }
  },

  fetchAllProducts: async function () {
    const {categories, fetchProducts} = get();
    const products = {};
    await Promise.all(
      categories?.map(async (category) => {
        const fetchedProducts = await fetchProducts(category._id);
        products[category._id] = fetchedProducts;
      })
    );
    set({ products });
  },

  fetchProducts: async (categoryId) => {
    try {
      const res = await axios.post(`/api/public/get-categories`, {
        categoryId: categoryId,
      });

      set((state) => ({
        products: {
          ...state.products,
          [categoryId]: res.data.data.products,
        },
      }));
    } catch (error) {
      //   console.error("Error fetching products:", error);
    }
  },
}));

export default usePublicStore;
