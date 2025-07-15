import { ImageUploadAction, PromptImageWithLoading } from "@/hooks/use-image-upload";
import { Reducer } from "react";

export const imageUploadReducer: Reducer<PromptImageWithLoading[], ImageUploadAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD": {
      const newImages = action.payload.map(({ url }) => ({
        url,
        loading: true,
      }));
      return [...state, ...newImages];
    }
    case "UPDATE_URL": {
      return state.map((image) =>
        image.url === action.payload.tempUrl
          ? { ...image, url: action.payload.finalUrl, loading: false }
          : image
      );
    }
    case "REMOVE": {
      return state.filter((_, i) => i !== action.payload.index);
    }
    case "CLEAR": {
      return [];
    }
    default:
      return state;
  }
};

export const createSyncedImageUploadReducer = (
  setImagesDraft: (images: { url: string }[]) => void
): Reducer<PromptImageWithLoading[], ImageUploadAction> => {
  return (state, action) => {
    const newState = imageUploadReducer(state, action);
    if (action.type === "UPDATE_URL" || action.type === "REMOVE" || action.type === "CLEAR") {
      setImagesDraft(newState.filter((img) => !img.loading).map(({ url }) => ({ url })));
    }
    return newState;
  };
};
