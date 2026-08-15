import { create } from "zustand";

type AppState = {
  activeDomain: string;
  setActiveDomain: (domain: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  activeDomain: "web",
  setActiveDomain: (domain) => set({ activeDomain: domain }),
}));
