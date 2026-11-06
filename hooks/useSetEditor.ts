import { useCallback, useState } from 'react';
import { TOOLS } from '../CONSTANTS';
import { EditableSetData, Position } from '../lib/setEditorTypes';
import { useSessionPrefsStore } from '../lib/sessionPrefsStore';

type UseSetEditorArgs = {
  initialSetData: EditableSetData;
};

export function useSetEditor({ initialSetData }: UseSetEditorArgs) {
  const [setData, setSetData] = useState<EditableSetData>(initialSetData);
  const [isHeldActive, setIsHeldActive] = useState(false);

  const replaceSetData = useCallback((nextSetData: EditableSetData) => {
    setSetData(nextSetData);
  }, []);

  const isValidPosition = useCallback(
    (position: Position) => {
      return (
        Number.isInteger(position.row) &&
        Number.isInteger(position.col) &&
        position.row >= 0 &&
        position.col >= 0 &&
        position.row < setData.gridData.length &&
        position.col < (setData.gridData[0]?.length || 0)
      );
    },
    [setData.gridData],
  );

  const fillSingleBlock = useCallback(
    (position: Position, newColor: string) => {
      if (!isValidPosition(position)) return;

      setSetData((prevData) => {
        if (
          !prevData.gridData[position.row] ||
          !prevData.gridData[position.row][position.col]
        ) {
          return prevData;
        }

        const nextGridData = prevData.gridData.map((row, rowIndex) => {
          if (rowIndex !== position.row) return row;

          return row.map((block, colIndex) => {
            if (colIndex !== position.col) return block;
            return {
              ...block,
              color: newColor,
              opacity: 1,
            };
          });
        });

        return {
          ...prevData,
          gridData: nextGridData,
        };
      });
    },
    [isValidPosition],
  );

  const floodFill = useCallback(
    (position: Position, color: string) => {
      if (!isValidPosition(position)) return;

      setSetData((prevData) => {
        const image = prevData.gridData.map((row) =>
          row.map((block) => ({ ...block })),
        );
        const matrix = [
          [-1, 0],
          [0, 1],
          [1, 0],
          [0, -1],
        ];

        const sourceColor = image[position.row][position.col].color;
        if (sourceColor === color) return prevData;

        function fillPixel(row: number, col: number) {
          image[row][col].color = color;
          for (const [r, c] of matrix) {
            const nextRow = row + r;
            const nextCol = col + c;

            if (
              nextRow < 0 ||
              nextRow >= image.length ||
              nextCol < 0 ||
              nextCol >= image[0].length ||
              image[nextRow][nextCol].color !== sourceColor
            ) {
              continue;
            }

            fillPixel(nextRow, nextCol);
          }
        }

        fillPixel(position.row, position.col);

        return {
          ...prevData,
          gridData: image,
        };
      });
    },
    [isValidPosition],
  );

  const handlePointerDown = useCallback(
    (position: Position) => {
      if (!isValidPosition(position)) return;

      const { sessionPrefs, setCurrentColor } = useSessionPrefsStore.getState();
      const currentTool = sessionPrefs.currentTool;
      const currentColor = sessionPrefs.currentColor;

      if (currentTool === TOOLS.DRAW) {
        fillSingleBlock(position, currentColor);
      } else if (currentTool === TOOLS.ERASE) {
        fillSingleBlock(position, '#ffffff');
      } else if (currentTool === TOOLS.EYEDROP) {
        setCurrentColor(setData.gridData[position.row][position.col].color);
      } else if (currentTool === TOOLS.PAINTBUCKET) {
        floodFill(position, currentColor);
      }
    },
    [fillSingleBlock, floodFill, isValidPosition, setData.gridData],
  );

  const handlePointerEnter = useCallback(
    (position: Position) => {
      if (isHeldActive) {
        handlePointerDown(position);
      }
    },
    [handlePointerDown, isHeldActive],
  );

  const updateSetField = useCallback((name: string, value: string) => {
    setSetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  return {
    setData,
    setSetData,
    replaceSetData,
    updateSetField,
    handlePointerDown,
    handlePointerEnter,
    isHeldActive,
    setIsHeldActive,
  };
}
