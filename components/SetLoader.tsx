import { useContext } from 'react'
import styles from './SetLoader.module.scss'

import { SessionPrefsContext, AllSetsDataContext } from '../pages'
import { APPSTATE } from '../CONSTANTS'

export default function SetLoader({
    handleSetMode,
    handleLoadNew,
    handleLoad
}:{
    handleSetMode: Function,
    handleLoadNew: Function,
    handleLoad: Function
}) {
    
    const allSetsData = useContext(AllSetsDataContext);
    const sessionPrefs = useContext(SessionPrefsContext);
    
    return (
        <div className={styles.loader}>
            <div className={styles.actions}>
                <button className={styles.backButton} onClick={() => handleSetMode(APPSTATE.LOADER)}><img src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAABDJJREFUeF7t3NFy2kAMBdD6/z+azhQy0zaAjCyRFT59jb2srw5Cdki3y+Vy+eWfBIoT2MAqTtRyfxIAC4SWBMBqidWiYDHQkgBYLbFaFCwGWhIAqyVWi4LFQEsCYLXEalGwGGhJAKyWWC0KFgMtCYDVEqtFwWKgJQGwWmK1KFgMtCQAVkusFgXrTQa2bSt5pSlf+AWrpNzxImDFGTkikQBYidCcEicAVpyRIxIJgJUIzSlxAmDFGTniSQJVgB69hLvCk/ID61p4jxuK3wBggVVM6hZo0YNQH4Ut5Zm7qI6lY7XoBQusQ7AAeh6f4T3JCyywknSC4AzpTwPSsZLsdCwdK0lHxzoSnI6VTE/H0rGSdDzwPBKcjhWkpzPleIEFVk5OlJv/NdmQ3iFLx4reeZ5XpdyBBVYKTnQSWLeEDOkRldd+DhZYr4nZeTRYYO2k8tphYIH1mpidR4MF1k4qrx0GFlividl59OlgufvbKePgYWAdDPD/06f8QWnxZX9bDqzihMG6BgoWWMUJgNUSqI4FFlgtCXw4LHd/jWp2LP2xMxZYO6rfeAhYyXDNUs+DAwusZAJgtQSnY4EFVksCHw7LkP4Dana85PgZC6wdVf6BQ8AKQjdL5VSCBVZOTnAWWGCBdS8BM1aLi8OLjulYAB2u9VsXAOsWtyG91h1YYNWKuq0GFlhgtSQAVkusOhZYYFUkYEivSDFe43QdC6wYRcURYFWkaI1vCYAFRUsCYLXEalGwGGhJ4HSwHqVoqK/1BZbnWLWi/Ern3zx1rFpfOpaOVStKx9KxWkSBBRZYTxLwzdJOHvm1x8xYjy4RrHzxO88EK0jX3WKOH1hg5eQEZ4EFFlj3EjBjtbg4vOj4jmWoP2ygZQGwkrEa6p8HBxZYyQTAaglOxwILrJYEwGqJVcc6KSx3iy3vp92LfuzwDtZuAy0HglUcq4/Ia6BggVWcAFgtgepYYIHVksBJYRnqGzX9tfTpZiywwHpPArdX8fWb2rh1LLBqRX3leXEbc33usm0tAX8teraYdSwdq+UNBVYQq06WcwcWWDk5UW5mrOcJ6Vg5dzpW9M4z1KdkgQVWCk50ElhgRUZSPwcrFZvnXlFsYEUJPfi5oT646XFXmJMFFlg5OWavQ7n5KEzGp2PpWEk6HpweCU7HOpLenXN1smsoYIFVnABYPYH6FZCO1SHLR6GO1eHKN1FvqZqxinnpWDpWMan3PJ6Y8t15HetNvKo6GVhvKtiUlwFrSqWG7ROsYQWbsl2wplRq2D7BGlYw210zAXeFa9Zl/K7AGl/CNS8ArDXrMn5XYI0v4ZoXANaadRm/K7DGl3DNCwBrzbqM3xVY40u45gWAtWZdxu8KrPElXPMCwFqzLuN3Bdb4Eq55AWCtWZfxuwJrfAnXvACw1qzL+F2BNb6Ea14AWGvWZfyufgNb6axsZhyDogAAAABJRU5ErkJggg==`} alt='' /><br />Back to loader</button>
                <button className={styles.newSetButton} onClick={() => handleLoadNew()}><img src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAAA79JREFUeF7t3FFuIkAMBFG4/6GJtCdIBN22l5dvMp4plypf4fl6vV4PPwh8mMCTWB8m6rh/BIhFhAgBYkWwOpRYHIgQIFYEq0OJxYEIAWJFsDqUWByIECBWBKtDicWBCAFiRbA6lFgciBAgVgSrQ4nFgQgBYkWwOpRYHIgQIFYEq0OJxYEIAWJFsDqUWByIECBWBKtDicWBCAFiRbA69OvEej6fI1v/tn/fJFZJM2KVQE+NUawOecXqcH4oVgn01BjF6pBXrA5nxSpxHhujWB30itXhrFglzmNjFKuDXrE6nBWrxHlsjGJ10CtWh7NilTiPjVGsDnrF6nBWrBLnsTGK1UGvWB3OilXiPDZGsTroFavDWbFKnMfGKFYHvWJ1OCtWifPYGMXqoFesDmfFKnEeG6NYHfSK1eGsWCXOY2MUq4NesTqcFavEeWyMYnXQK1aHs2KVOI+NUawOesXqcFasEuexMYrVQa9YHc6KVeI8NkaxOugVq8NZsUqcx8YoVge9YnU4K9anOU8V4tPv+N/OS38RXLxYxNqpJLF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgecF2sb1qkvKUkvch3n15e9mFgdBeNfY9R5xu+nEOv3rN75JLHeofeH3/2yPwwPYv1Bjnc+Sqx36B34XX8KO0tSrA5nX25b4jw2RrE66BWrw1mxSpzHxihWB71idTgrVonz2BjF6qBXrA5nxSpxHhujWB30itXhrFglzmNjFKuDXrE6nBWrxHlsjGJ10CtWh7NilTiPjVGsDnrF6nBWrBLnsTGK1UGvWB3OilXiPDZGsTroFavDWbFKnMfGKFYHvWJ1OCtWifPYGMXqoFesDmfFKnEeG6NYHfSK1eGsWCXOY2MUq4NesTqcFavEeWyMYnXQK1aHs2KVOI+NUawO+q8rVgerKcTiQIQAsSJYHUosDkQIECuC1aHE4kCEALEiWB1KLA5ECBArgtWhxOJAhACxIlgdSiwORAgQK4LVocTiQIQAsSJYHUosDkQIECuC1aHE4kCEALEiWB1KLA5ECBArgtWhxOJAhACxIlgdSiwORAj8AOjDiGxOJiFrAAAAAElFTkSuQmCC`} alt='' /><br />Create new</button>
            </div>
            <div className={styles.setLoader}>
                {allSetsData.map((set: {_id: string, thumbnail: string, set_name: string}, index) => {
                return (
                    <button
                    key={set._id}
                    className={`${styles.setButton} ${(sessionPrefs.currentSetId === set._id) ? styles.setButtonSelected : ''}`}
                    onClick={() => handleLoad(set._id)}
                    >
                    <img src={`${set.thumbnail}`} alt='' />
                    <br />
                    {set.set_name}
                    </button>
                )
                })}
            </div>
        </div>
    )
}