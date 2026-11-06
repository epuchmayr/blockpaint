import { create } from 'zustand';
import { GRID, PREFS, TOOLS } from '../CONSTANTS';

export type SessionPrefs = {
  currentColor: string;
  currentTool: string;
  currentSetId: string;
  colorHistory: string[];
};

type SessionPrefsState = {
  sessionPrefs: SessionPrefs;
  setCurrentColor: (color: string) => void;
  setCurrentTool: (tool: string) => void;
  setCurrentSetId: (setId: string) => void;
  addColorToHistory: (color: string) => void;
  patchSessionPrefs: (prefs: Partial<SessionPrefs>) => void;
  resetSessionPrefs: () => void;
};

const defaultSessionPrefs: SessionPrefs = {
  currentColor: GRID.DEFAULT_COLOR,
  currentTool: TOOLS.DRAW,
  currentSetId: '',
  colorHistory: [GRID.DEFAULT_COLOR],
};

export const useSessionPrefsStore = create<SessionPrefsState>((set) => ({
  sessionPrefs: defaultSessionPrefs,
  setCurrentColor: (color) => {
    set((state) => ({
      sessionPrefs: {
        ...state.sessionPrefs,
        currentColor: color,
      },
    }));
  },
  setCurrentTool: (tool) => {
    set((state) => ({
      sessionPrefs: {
        ...state.sessionPrefs,
        currentTool: tool,
      },
    }));
  },
  setCurrentSetId: (setId) => {
    set((state) => ({
      sessionPrefs: {
        ...state.sessionPrefs,
        currentSetId: setId,
      },
    }));
  },
  addColorToHistory: (color) => {
    set((state) => {
      if (state.sessionPrefs.colorHistory[0] === color) {
        return state;
      }

      const nextColorHistory = [
        color,
        ...state.sessionPrefs.colorHistory.filter((entry) => entry !== color),
      ].slice(0, PREFS.SWATCH_HISTORY_SIZE);

      return {
        sessionPrefs: {
          ...state.sessionPrefs,
          colorHistory: nextColorHistory,
        },
      };
    });
  },
  patchSessionPrefs: (prefs) => {
    set((state) => ({
      sessionPrefs: {
        ...state.sessionPrefs,
        ...prefs,
      },
    }));
  },
  resetSessionPrefs: () => {
    set({
      sessionPrefs: defaultSessionPrefs,
    });
  },
}));
