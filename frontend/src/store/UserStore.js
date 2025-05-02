import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,

  async fetchUser() {
    try {
      const { data } = await axios.get("/api/auth/me");
      const res = await axios.post("/api/users/get-meta", {
        email: data?.email,
      });
      data.role = res.data?.role;
      set({ user: data });
    } catch (err) {
      console.error(err);
      toast.error("Please login first.");
      window.location.href = "/api/auth/google";
    }
  },

  async fetchUserIfSignedIn() {
    try {
      const { data } = await axios.get("/api/auth/me");
      const res = await axios.post("/api/users/get-meta", {
        email: data?.email,
      });
      data.role = res.data?.role;
      set({ user: data });
    } catch (err) {}
  },
}));
