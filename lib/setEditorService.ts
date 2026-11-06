import { GRID } from '../CONSTANTS';
import { EditableSetData, ServerSetData } from './setEditorTypes';

const GRIDWIDTH = GRID.DEFAULT_WIDTH;
const GRIDHEIGHT = GRID.DEFAULT_HEIGHT;
const DEFAULTBLOCK = GRID.DEFAULT_BLOCK;

export function createEmptyGrid() {
  const gridRow = Array.from(Array(GRIDWIDTH), () => {
    return { ...DEFAULTBLOCK };
  });

  return Array.from(Array(GRIDHEIGHT), () => {
    return Array.from(gridRow, (cell) => ({ ...cell }));
  });
}

export function createNewSetData(): EditableSetData {
  const now = new Date().toISOString();
  return {
    gridData: createEmptyGrid(),
    setName: '',
    gridWidth: String(GRIDWIDTH),
    gridHeight: String(GRIDHEIGHT),
    createdDate: now,
    lastUpdate: now,
    creator: '',
    isLocked: false,
    id: '',
  };
}

export function fromServerSetData(setData: ServerSetData): EditableSetData {
  return {
    gridData: JSON.parse(JSON.stringify(setData.grid_data)),
    gridWidth: setData.grid_width,
    gridHeight: setData.grid_height,
    setName: setData.set_name || '',
    createdDate: setData.created_date,
    lastUpdate: setData.last_update,
    creator: setData.creator,
    isLocked: setData.isLocked,
    id: setData._id,
  };
}

export async function fetchSetById(setId: string): Promise<ServerSetData> {
  const response = await fetch(`/api/blockSet/${setId}`);
  return response.json();
}

export async function saveSetData(
  setData: EditableSetData,
  encodedImage: string,
): Promise<{ insertedId?: string }> {
  if (setData.id) {
    await fetch(`/api/blockSet/update/${setData.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grid_data: setData.gridData,
        thumbnail: encodedImage,
        set_name: setData.setName,
        last_update: new Date(),
      }),
    });

    return {};
  }

  const response = await fetch(`/api/blockSet/createSet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grid_data: setData.gridData,
      grid_width: setData.gridWidth,
      grid_height: setData.gridHeight,
      thumbnail: encodedImage,
      set_name: setData.setName,
      created_date: new Date(),
      last_update: new Date(),
      creator: setData.creator,
      isLocked: setData.isLocked,
    }),
  });

  return response.json();
}
