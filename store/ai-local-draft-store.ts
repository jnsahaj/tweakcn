import { JSONContent } from "@tiptap/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AILocalDraftStore {
  editorContentDraft: JSONContent | null;
  setEditorContentDraft: (content: JSONContent | null) => void;
  clearLocalDraft: () => void;
}

export const useAILocalDraftStore = create<AILocalDraftStore>()(
  persist(
    (set) => ({
      editorContentDraft: null,
      setEditorContentDraft: (content) => set({ editorContentDraft: content }),
      clearLocalDraft: () => set({ editorContentDraft: null }),
    }),
    {
      name: "ai-local-draft-store",
    }
  )
);
