import { create } from "zustand";

interface GoProDialogState {
  isOpen: boolean;
  openGoProDialog: () => void;
  closeGoProDialog: () => void;
}

export const useGoProDialogStore = create<GoProDialogState>()((set) => ({
  isOpen: false,
  openGoProDialog: () =>
    set({
      isOpen: true,
    }),
  closeGoProDialog: () =>
    set({
      isOpen: false,
    }),
}));
