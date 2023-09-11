import styles from './Grid.module.scss';

export default function Grid({
  gridData,
  handlePointerDown,
  handlePointerEnter,
}: {
  gridData: { color: string; opacity: number }[][];
  handlePointerDown: Function;
  handlePointerEnter: Function;
}) {
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
                    const newElement = document.elementFromPoint(e.pageX - window.scrollX, e.pageY - window.scrollY)
                    handlePointerEnter(e, { row: newElement?.getAttribute('data-row'), col: newElement?.getAttribute('data-col') });
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
