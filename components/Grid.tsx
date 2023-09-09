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
    <>
      <div className={`${styles.colorGrid} touch-none`}>
        {gridData.map((gridRow, row) => {
          return (
            <>
              <div key={`row${row}`} className={`${styles.gridRow} row-${row}`}>
                {gridRow.map((block, col) => {
                  return (
                    <>
                      <button
                        key={`block${row}${col}`}
                        className={styles.colorBlock}
                        style={{ backgroundColor: block.color.toString() }}
                        onPointerDown={(e) => {
                          handlePointerDown(e, { row: row, col: col });
                          // proper typing for event
                          const target = e.target as HTMLButtonElement;
                          // release capture for mobile drag
                          target.releasePointerCapture(e.pointerId);
                        }}
                        onPointerEnter={(e) =>
                          handlePointerEnter(e, { row: row, col: col })
                        }
                      ></button>
                    </>
                  );
                })}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
