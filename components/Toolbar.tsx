import { TOOLS } from '../CONSTANTS'
import styles from './Toolbar.module.css'


export default function Toolbar({handleClickTool, currentTool}:{
        handleClickTool: Function,
        currentTool: string
    }) {



    return (
        
        <div className={styles.toolbar}>

            {Object.keys(TOOLS).map((value, index) => {

            let isToolSelected = (currentTool === TOOLS[value]) ? 'selected': ''

            return (
                <button key={`${index}-${TOOLS[value]}`} className={`${styles.tool} ${styles[value.toLowerCase()]} ${isToolSelected && styles.toolSelected}`} value={TOOLS[value]} onClick={handleClickTool}>{value}</button>
            )
            })}
            <style jsx>{`
            `}</style>
        </div>
    )



}