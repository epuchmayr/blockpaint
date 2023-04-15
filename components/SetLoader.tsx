import { useContext } from 'react'
import styles from './SetLoader.module.css'

import { SessionPrefsContext, SetsDataContext } from '../pages'

export default function SetLoader({
    handleLoadNew,
    handleLoad
}:{
    handleLoadNew: Function,
    handleLoad: Function
}) {
    
    const setsData = useContext(SetsDataContext);
    const sessionPrefs = useContext(SessionPrefsContext);
    
    return (
        <div className={styles.setLoader}>
            <button onClick={() => handleLoadNew()}>Create new</button>
            {setsData.map((set: {_id: string, thumbnail: string}, index) => {
            return (
                <button
                key={set._id}
                className={`${styles.setButton} ${(sessionPrefs.currentSetId === set._id) ? styles.setButtonSelected : ''}`}
                onClick={() => handleLoad(set._id)}
                >
                <img src={`${set.thumbnail}`} alt='' /><br />
                {`${set._id}`}
                </button>
            )
            })}
        </div>
    )
}