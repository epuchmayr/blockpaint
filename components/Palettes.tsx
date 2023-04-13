import { MouseEventHandler, useContext } from 'react'
import styles from './Palettes.module.css'
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
            title={'Basic Colours'}
            swatches={SWATCHES.DEFAULT}
            clickHandler={handleChangeColor}
          />
        <Palette
            title={'Colour History'}
            swatches={sessionPrefs.colorHistory}
            clickHandler={handleChangeColor}
        />
    </div>
    )
}