import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PostLoginActionType, StoredPostLoginAction } from "@/hooks/use-post-login-action";

interface AuthStore {
  isOpen: boolean;
  mode: "signin" | "signup";
  postLoginAction: StoredPostLoginAction;
  openAuthDialog: (
    mode?: "signin" | "signup",
    postLoginActionType?: PostLoginActionType,
    postLoginActionData?: any
  ) => void;
  closeAuthDialog: () => void;
  clearPostLoginAction: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isOpen: false,
      mode: "signin",
      postLoginAction: null,
      openAuthDialog: (
        newMode?: "signin" | "signup",
        postLoginActionType?: PostLoginActionType,
        postLoginActionData?: any
      ) => {
        set((state) => ({
          isOpen: true,
          mode: newMode || state.mode,
          postLoginAction: postLoginActionType
            ? { type: postLoginActionType, data: postLoginActionData }
            : null,
        }));
      },
      closeAuthDialog: () => {
        set({ isOpen: false });
      },
      clearPostLoginAction: () => {
        set({ postLoginAction: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ postLoginAction: state.postLoginAction }),
    }
  )
);
