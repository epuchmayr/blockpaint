import { ChangeEventHandler, FocusEventHandler, MouseEventHandler,useContext } from 'react'
import { TOOLS } from '../CONSTANTS'
import styles from './Toolbar.module.css'

import { SessionPrefsContext } from '../pages/index'


function ToolSelectMenu({handleClickTool}:{
    handleClickTool: MouseEventHandler
}) {

    const sessionPrefs = useContext(SessionPrefsContext);
    return (
        
        <div className={styles.toolSelectMenu}>

            {Object.keys(TOOLS).map((value, index) => {
            let isToolSelected = (sessionPrefs.currentTool === TOOLS[value]) ? 'selected': ''

            return (
                <button
                    key={`${index}-${TOOLS[value]}`}
                    className={`${styles.tool} ${styles[value.toLowerCase()]} ${isToolSelected && styles.toolSelected}`}
                    value={TOOLS[value].toString()}
                    onClick={handleClickTool}
                >
                    {value}
                </button>
            )
            })}

        </div>
    )
}





export default function Toolbar({handleClickTool, handlePickerChange, handlePickerBlur}:{
        handleClickTool: MouseEventHandler
        handlePickerChange: ChangeEventHandler
        handlePickerBlur: FocusEventHandler
    }) {

    const sessionPrefs = useContext(SessionPrefsContext);

    return (
        <aside className={styles.toolbar}>
            <ToolSelectMenu handleClickTool={handleClickTool} />
        <label>
            <input
            className={styles.foregroundColour}
            name='color'
            type='color'
            value={sessionPrefs.currentColor.toString()}
            onChange={handlePickerChange}
            onBlur={handlePickerBlur}
            />
          </label>
        </aside>
    )

}