import {
  Lava3DPosition,
  Lava3DSetData,
  Lava3DTile,
  Lava3DTileKind,
} from './types';

export const LAVA_3D_COLORS = {
  void: '#ffffff',
  platform: '#000000',
  lava: '#ff0000',
  goal: '#00ff00',
  spawn: '#0000ff',
  coin: '#ffff00',
  collectedCoin: '#b8860b',
} as const;

export function getTileKind(color: string): Lava3DTileKind {
  const normalized = color.toLowerCase();

  switch (normalized) {
    case LAVA_3D_COLORS.void:
      return 'void';
    case LAVA_3D_COLORS.platform:
      return 'platform';
    case LAVA_3D_COLORS.lava:
      return 'lava';
    case LAVA_3D_COLORS.goal:
      return 'goal';
    case LAVA_3D_COLORS.spawn:
      return 'spawn';
    case LAVA_3D_COLORS.coin:
      return 'coin';
    default:
      return 'unknown';
  }
}

export function buildLava3DTiles(setData: Lava3DSetData): Lava3DTile[] {
  const tiles: Lava3DTile[] = [];

  setData.gridData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      tiles.push({
        id: `${rowIndex}-${colIndex}`,
        row: rowIndex,
        col: colIndex,
        color: cell.color.toLowerCase(),
        kind: getTileKind(cell.color),
      });
    });
  });

  return tiles;
}

export function getSpawnPosition(tiles: Lava3DTile[]): Lava3DPosition {
  const spawnTile = tiles.find((tile) => tile.kind === 'spawn');
  if (spawnTile) {
    return {
      row: spawnTile.row,
      col: spawnTile.col,
    };
  }

  const fallbackTile = tiles.find((tile) => isWalkableTileKind(tile.kind));
  if (fallbackTile) {
    return {
      row: fallbackTile.row,
      col: fallbackTile.col,
    };
  }

  return { row: 0, col: 0 };
}

export function getTileAtPosition(
  tilesByKey: Record<string, Lava3DTile>,
  position: Lava3DPosition,
) {
  return tilesByKey[`${position.row}-${position.col}`];
}

export function isWalkableTileKind(kind: Lava3DTileKind) {
  return kind === 'platform' || kind === 'goal' || kind === 'spawn' || kind === 'coin';
}

export function isHazardTileKind(kind: Lava3DTileKind) {
  return kind === 'lava';
}

export function getWorldPositionFromGridPosition(
  position: Lava3DPosition,
  rowCount: number,
  colCount: number,
  tileSize: number,
) {
  const x = (position.col - (colCount - 1) / 2) * tileSize;
  const z = (position.row - (rowCount - 1) / 2) * tileSize;

  return { x, z };
}
