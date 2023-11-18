import { createRouteLoader } from "next/dist/client/route-loader"

export const APPSTATE: {
    [index: string]: string
} = {
    LOADER: 'loader',
    CREATOR: 'creator',
    GAMING: 'gaming'
}

export const TOOLS: {
    [index: string]: string
} = {
    DRAW: '1',
    ERASE: '2',
    EYEDROP: '3',
    PAINTBUCKET: '4'
}

export const GRID = {
    DEFAULT_COLOR: '#000000',
    DEFAULT_OPACITY: 1,
    DEFAULT_WIDTH: 25,
    DEFAULT_HEIGHT: 25,
    DEFAULT_BLOCK: {
        color: '#ffffff',
        opacity: 1
      }
}

export const PREFS: {
    [index: string]: number
} = {
    SWATCH_HISTORY_SIZE: 24
}

export const SWATCHES = [
    {
        name: 'Basic Colours',
        colors: ['#ffffff', '#000000', '#ff0000', '#ffff00', '#00ffff', '#00ff00', '#0000ff', '#ff00ff']
    },
    {
        name: 'Pastel Colours',
        colors: ['#fbf8cc', '#fde4cf', '#ffcfd2', '#f1c0e8', '#cfbaf0', '#a3c4f3', '#90dbf4', '#8eecf5', '#98f5e1', '#b9fbc0']
    },
    {
        name: 'Ombre Light',
        colors: ['#fff0f7', '#ffe4ef', '#ffcddf', '#ffc2d4', '#f6a6bb', '#f191ac',
                '#f0fff7', '#e4ffef', '#cdffdf', '#c2ffd4', '#a6f6bb', '#91f1ac',
                '#f0f7ff', '#e4efff', '#cddfff', '#c2d4ff', '#a6bbf6', '#91acf1']
    }
]