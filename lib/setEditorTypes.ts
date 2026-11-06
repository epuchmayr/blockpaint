export type GridCell = {
  color: string;
  opacity: number;
};

export type GridData = GridCell[][];

export type EditableSetData = {
  gridData: GridData;
  gridWidth: string | number;
  gridHeight: string | number;
  setName: string;
  createdDate: string;
  lastUpdate: string;
  creator: string;
  isLocked: boolean;
  id: string;
};

export type ServerSetData = {
  _id: string;
  grid_data: GridData;
  grid_width: string | number;
  grid_height: string | number;
  thumbnail: string;
  created_date: string;
  last_update: string;
  creator: string;
  isLocked: boolean;
  set_name: string;
};

export type Position = {
  row: number;
  col: number;
};
