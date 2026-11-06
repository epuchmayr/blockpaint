import { CurrentSetData } from '../currentSetStore';
import { BoardPiece, SpawnPosition } from '../gameTypes';

export function getCanvasDimensions(windowWidth: number) {
  const width = Math.min(600, windowWidth);
  return {
    canvasWidth: width,
    canvasHeight: width,
  };
}

export function buildBoardPieces(
  setData: CurrentSetData,
  canvasWidth: number,
  canvasHeight: number,
): BoardPiece[] {
  const gridData = setData.gridData;
  if (!gridData.length || !gridData[0]?.length) return [];

  const blockWidth = canvasWidth / gridData[0].length;
  const blockHeight = canvasHeight / gridData.length;

  const background: BoardPiece[] = [];
  const walls: BoardPiece[] = [];
  const goals: BoardPiece[] = [];
  const players: BoardPiece[] = [];

  gridData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const base = {
        x: colIndex * blockWidth,
        y: rowIndex * blockHeight,
        width: blockWidth,
        height: blockHeight,
      };

      const piece: BoardPiece = {
        id: `${rowIndex}-${colIndex}`,
        type: 'background',
        color: cell.color,
        attrs: base,
      };

      if (cell.color === '#0000ff') {
        players.push({
          ...piece,
          type: 'player',
          attrs: {
            x: base.x + 1,
            y: base.y + 1,
            width: base.width - 2,
            height: base.height - 2,
          },
        });
      } else if (cell.color === '#ff0000') {
        goals.push({ ...piece, type: 'goal' });
      } else if (cell.color === '#000000') {
        walls.push({ ...piece, type: 'wall' });
      } else {
        background.push(piece);
      }
    });
  });

  return [...background, ...walls, ...goals, ...players];
}

export function getSpawnPosition(
  setData: CurrentSetData,
  canvasWidth: number,
  canvasHeight: number,
): SpawnPosition {
  const gridData = setData.gridData;
  if (!gridData.length || !gridData[0]?.length) return { x: 1, y: 1 };

  const blockWidth = canvasWidth / gridData[0].length;
  const blockHeight = canvasHeight / gridData.length;

  for (let row = 0; row < gridData.length; row++) {
    for (let col = 0; col < gridData[row].length; col++) {
      if (gridData[row][col].color === '#0000ff') {
        return {
          x: col * blockWidth + 1,
          y: row * blockHeight + 1,
        };
      }
    }
  }

  return { x: 1, y: 1 };
}
