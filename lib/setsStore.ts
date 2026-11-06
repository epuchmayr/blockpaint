import { create } from 'zustand';

export type SetListItem = {
  _id: string;
  thumbnail: string;
  set_name: string;
};

type SetsState = {
  setsData: SetListItem[];
  setSetsData: (sets: SetListItem[]) => void;
  clearSetsData: () => void;
};

export const useSetsStore = create<SetsState>((set) => ({
  setsData: [],
  setSetsData: (sets) => {
    set({ setsData: sets });
  },
  clearSetsData: () => {
    set({ setsData: [] });
  },
}));
