import { create } from "zustand";

type Props = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSidebar = create<Props>((set) => ({
  isOpen: false,
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false });
  },
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
