import { MouseEventHandler, useContext } from 'react'
import styles from './Palettes.module.scss'
import Palette from '../components/Palette'
import { SWATCHES } from '../CONSTANTS'

import { SessionPrefsContext } from '../pages'


export default function Palettes({
    handleChangeColor
} : {
    handleChangeColor: MouseEventHandler
    }) {

    const sessionPrefs = useContext(SessionPrefsContext);

    return (
    <div className={styles.palettes}>
        <Palette
            title={'Colour History'}
            swatches={sessionPrefs.colorHistory}
            clickHandler={handleChangeColor}
        />
        {SWATCHES.map((swatch, index) => {
            return (
                <Palette
                    key={index}
                    title={swatch.name}
                    swatches={swatch.colors}
                    clickHandler={handleChangeColor}
                />
            )
        })}
    </div>
    )
}