import { create } from "zustand";

type User = {
  id: string;
  email: string;
  [key: string]: any;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    set({ user: null });
  },
}));
