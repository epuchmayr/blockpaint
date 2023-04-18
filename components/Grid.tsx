import styles from './Grid.module.scss'

export default function Grid({
    gridData,
    handleMouseDown,
    handleMouseEnter
}: {
    gridData: {color: string, opacity: number}[][],
    handleMouseDown: Function
    handleMouseEnter: Function
}) {

    return (
        <>
        <div className={styles.colorGrid}>
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
                                    style={{backgroundColor: block.color.toString()}}
                                    onMouseDown={(e) => handleMouseDown(e, {row: row, col: col})}
                                    onMouseEnter={(e) => handleMouseEnter(e, {row: row, col: col})}
                                    ></button>
                                </>
                            )
                        })}
                    </div>
                    </>
                )
            })}
        </div>
        </>
    )
}

