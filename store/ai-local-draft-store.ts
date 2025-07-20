import { JSONContent } from "@tiptap/react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { idbStorage } from "./idb-storage";

interface AILocalDraftStore {
  editorContentDraft: JSONContent | null;
  setEditorContentDraft: (content: JSONContent | null) => void;
  imagesDraft: { url: string }[];
  setImagesDraft: (imagesDraft: { url: string }[]) => void;
  clearLocalDraft: () => void;
}

export const useAILocalDraftStore = create<AILocalDraftStore>()(
  persist(
    (set) => ({
      editorContentDraft: null,
      setEditorContentDraft: (content) => set({ editorContentDraft: content }),
      imagesDraft: [],
      setImagesDraft: (images) => set({ imagesDraft: images }),
      clearLocalDraft: () => set({ editorContentDraft: null, imagesDraft: [] }),
    }),
    {
      name: "ai-local-draft-store",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
