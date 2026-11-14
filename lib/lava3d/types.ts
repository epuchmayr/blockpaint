import { GridBlock } from '../currentSetStore';

export type Lava3DSetData = {
  id: string;
  gridData: GridBlock[][];
  gridWidth: number;
  gridHeight: number;
  setName: string;
};

export type Lava3DDirection = 'up' | 'right' | 'down' | 'left';

export type Lava3DTileKind =
  | 'void'
  | 'platform'
  | 'lava'
  | 'goal'
  | 'spawn'
  | 'coin'
  | 'unknown';

export type Lava3DTile = {
  id: string;
  row: number;
  col: number;
  color: string;
  kind: Lava3DTileKind;
};

export type Lava3DPosition = {
  row: number;
  col: number;
};
