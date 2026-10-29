import styles from './Grid.module.scss';

interface Position {
  row: number;
  col: number;
}

export default function Grid({
  gridData,
  handlePointerDown,
  handlePointerEnter,
}: {
  gridData: { color: string; opacity: number }[][];
  handlePointerDown: Function;
  handlePointerEnter: Function;
}) {
  function getPositionFromEvent(event: {
    clientX: number;
    clientY: number;
  }): Position | null {
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const blockElement = element?.closest(
      '[data-row][data-col]',
    ) as HTMLElement | null;

    if (!blockElement) return null;

    const row = Number(blockElement.getAttribute('data-row'));
    const col = Number(blockElement.getAttribute('data-col'));

    if (!Number.isInteger(row) || !Number.isInteger(col)) return null;

    return { row, col };
  }

  return (
    <div className={`${styles.colorGrid} touch-none`}>
      {gridData.map((gridRow, row) => {
        return (
          <div key={`row${row}`} className={`${styles.gridRow} row-${row}`}>
            {gridRow.map((block, col) => {
              return (
                <button
                  key={`block${row}${col}`}
                  className={`${styles.colorBlock}`}
                  style={{ backgroundColor: String(block.color) }}
                  data-row={row}
                  data-col={col}
                  onPointerDown={(e) => {
                    handlePointerDown(e, { row: row, col: col });
                  }}
                  onPointerEnter={(e) => {
                    handlePointerEnter(e, { row: row, col: col });
                  }}
                  onPointerMove={(e) => {
                    // use pointer move for mobile to test changing element under input position
                    const position = getPositionFromEvent(e);
                    if (!position) return;
                    handlePointerEnter(e, position);
                  }}
                ></button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
