import { create } from 'zustand';

export type GridBlock = {
  color: string;
  opacity?: number;
};

export type CurrentSetData = {
  id: string;
  gridData: GridBlock[][];
  gridWidth: number;
  gridHeight: number;
  setName: string;
};

type CurrentSetState = {
  currentSetData: CurrentSetData;
  setCurrentSetData: (setData: CurrentSetData) => void;
  patchCurrentSetData: (setData: Partial<CurrentSetData>) => void;
  resetCurrentSetData: () => void;
};

const defaultCurrentSetData: CurrentSetData = {
  id: '',
  gridData: [],
  gridWidth: 0,
  gridHeight: 0,
  setName: '',
};

export const useCurrentSetStore = create<CurrentSetState>((set) => ({
  currentSetData: defaultCurrentSetData,
  setCurrentSetData: (setData) => {
    set({ currentSetData: setData });
  },
  patchCurrentSetData: (setData) => {
    set((state) => ({
      currentSetData: {
        ...state.currentSetData,
        ...setData,
      },
    }));
  },
  resetCurrentSetData: () => {
    set({ currentSetData: defaultCurrentSetData });
  },
}));
