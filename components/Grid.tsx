import styles from './Grid.module.css'

export default function Grid({
    gridData,
    handleMouseDown,
    handleMouseEnter
}: {
    gridData: [],
    handleMouseDown: Function
    handleMouseEnter: Function
}) {

    return (
        <>
        <div className={styles.colorGrid}>
            {gridData.map((gridRow: [], row) => {
                return (
                    <>
                    <div key={`row${row}`} className={`${styles.gridRow} row-${row}`}>
                        {gridRow.map((block: {color: string}, col) => {
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

