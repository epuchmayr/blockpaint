
interface CONSTANTS {
    [index: string]: number | string | Object;
}

export const TOOLS: CONSTANTS = {
    DRAW: '1',
    ERASE: '2',
    EYEDROP: '3'
}

export const GRID: CONSTANTS = {
    DEFAULT_COLOR: '#000000',
    DEFAULT_OPACITY: 1,
    DEFAULT_WIDTH: 25,
    DEFAULT_HEIGHT: 25,
    DEFAULT_BLOCK: {
        color: '#ffffff',
        opacity: 1
      }
}

export const PREFS: CONSTANTS = {
    SWATCH_HISTORY_SIZE: 24
}