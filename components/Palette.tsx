import { MouseEventHandler } from 'react'
import styles from './Palette.module.css'


export default function Palette({
    title,
    swatches,
    clickHandler
} : {
    title: string
    swatches: string[]
    clickHandler: MouseEventHandler
    }) {


    return (
    <div className={styles.palette}>
        <label className={styles.title}>{title}</label>
        <div className={styles.swatches}>
        {swatches.map((value, index) => {
            return (<button
            key={index + value}
            style={{backgroundColor: value}}
            className={styles.swatch}
            value={value}
            onClick={clickHandler}
            ></button>)
        })}
        </div>
    </div>
    )
}