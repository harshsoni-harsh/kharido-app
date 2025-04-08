import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,

  async fetchUser() {
    try {
      const { data } = await axios.get("/api/auth/me");
      set({ user: data });
      return data;
    } catch (err) {
      console.error(err);
      toast.error("Please login first.");
      window.location.href = '/api/auth/google'
    }
  },
}));
