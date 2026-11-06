export type Attributes = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BoardPieceType = 'background' | 'wall' | 'goal' | 'player';

export type BoardPiece = {
  id: string;
  type: BoardPieceType;
  color: string;
  attrs: Attributes;
};

export type SpawnPosition = {
  x: number;
  y: number;
};
