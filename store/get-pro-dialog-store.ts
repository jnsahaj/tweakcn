import { create } from "zustand";

interface GetProDialogState {
  isOpen: boolean;
  openGetProDialog: () => void;
  closeGetProDialog: () => void;
}

export const useGetProDialogStore = create<GetProDialogState>()((set) => ({
  isOpen: false,
  openGetProDialog: () =>
    set({
      isOpen: true,
    }),
  closeGetProDialog: () =>
    set({
      isOpen: false,
    }),
}));
