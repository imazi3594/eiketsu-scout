import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 5;

type ScoutState = {
  query: string;
  selectedId: string | null;
  recents: string[];
  notes: Record<string, string>;
  setQuery: (q: string) => void;
  select: (id: string | null) => void;
  setNote: (id: string, note: string) => void;
  touchRecent: (id: string) => void;
};

export const useScout = create<ScoutState>()(
  persist(
    (set, get) => ({
      query: "",
      selectedId: null,
      recents: [],
      notes: {},
      setQuery: (query) => set({ query }),
      select: (selectedId) => {
        if (selectedId) get().touchRecent(selectedId);
        set({ selectedId });
      },
      setNote: (id, note) => set({ notes: { ...get().notes, [id]: note } }),
      touchRecent: (id) => {
        const next = [id, ...get().recents.filter((x) => x !== id)].slice(0, MAX_RECENT);
        set({ recents: next });
      },
    }),
    {
      name: "eiketsu-scout",
      skipHydration: true,
      partialize: (s) => ({
        recents: s.recents,
        notes: s.notes,
      }),
    },
  ),
);
