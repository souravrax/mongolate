import { openDB } from "idb";

const dbPromise = openDB("mongolate-app", 1, {
  upgrade(db) {
    db.createObjectStore("zustand");
  },
});

export const storage = {
  getItem: async (name: string): Promise<string | null> => {
    const db = await dbPromise;
    return (await db.get("zustand", name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const db = await dbPromise;
    await db.put("zustand", value, name);
  },
  removeItem: async (name: string): Promise<void> => {
    const db = await dbPromise;
    await db.delete("zustand", name);
  },
};
