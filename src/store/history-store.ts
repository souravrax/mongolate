import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { storage } from "@/lib/db";

export interface TranslationRecord {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

interface HistoryStore {
  history: TranslationRecord[];
  saveTranslation: (record: Omit<TranslationRecord, "id" | "timestamp">) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      history: [],
      saveTranslation: (record) =>
        set((state) => ({
          history: [
            {
              ...record,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.history,
          ],
        })),
      removeItem: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "translation-history",
      storage: createJSONStorage(() => storage),
    }
  )
);
