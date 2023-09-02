import { useContext } from 'react';
import styles from './SetLoaderFull.module.scss';
import Link from 'next/link';

import { SessionPrefsContext, AllSetsDataContext } from '../pages';

export default function SetLoaderFull({
  handleLoadNew,
  handleLoad,
}: {
  handleLoadNew: Function;
  handleLoad: Function;
}) {
  const allSetsData = useContext(AllSetsDataContext);
  const sessionPrefs = useContext(SessionPrefsContext);

  return (
    <div className={styles.loader}>
      <div className={styles.setLoader}>
        {allSetsData.map(
          (set: { _id: string; thumbnail: string; set_name: string }) => {
            return (
              <>
                <Link
                  className={`${styles.setButton} ${
                    sessionPrefs.currentSetId === set._id
                      ? styles.setButtonSelected
                      : ''
                  }`}
                  href={`/set/${set._id}`}
                  as={`/set/${set._id}`}
                >
                  <img src={`${set.thumbnail}`} alt='' />
                  <br />
                  {set.set_name || '[unnamed]'}
                </Link>
              </>
            );
          }
        )}
      </div>
      <button className={styles.newSetButton} onClick={() => handleLoadNew()}>
        <img
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAAXNSR0IArs4c6QAAA79JREFUeF7t3FFuIkAMBFG4/6GJtCdIBN22l5dvMp4plypf4fl6vV4PPwh8mMCTWB8m6rh/BIhFhAgBYkWwOpRYHIgQIFYEq0OJxYEIAWJFsDqUWByIECBWBKtDicWBCAFiRbA6lFgciBAgVgSrQ4nFgQgBYkWwOpRYHIgQIFYEq0OJxYEIAWJFsDqUWByIECBWBKtDicWBCAFiRbA69OvEej6fI1v/tn/fJFZJM2KVQE+NUawOecXqcH4oVgn01BjF6pBXrA5nxSpxHhujWB30itXhrFglzmNjFKuDXrE6nBWrxHlsjGJ10CtWh7NilTiPjVGsDnrF6nBWrBLnsTGK1UGvWB3OilXiPDZGsTroFavDWbFKnMfGKFYHvWJ1OCtWifPYGMXqoFesDmfFKnEeG6NYHfSK1eGsWCXOY2MUq4NesTqcFavEeWyMYnXQK1aHs2KVOI+NUawOesXqcFasEuexMYrVQa9YHc6KVeI8NkaxOugVq8NZsUqcx8YoVge9YnU4K9anOU8V4tPv+N/OS38RXLxYxNqpJLF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgcQa+dezt+KWOdXuPMBxNq5l/O3Itb5Fe58ALF27uX8rYh1foU7H0CsnXs5fytinV/hzgecF2sb1qkvKUkvch3n15e9mFgdBeNfY9R5xu+nEOv3rN75JLHeofeH3/2yPwwPYv1Bjnc+Sqx36B34XX8KO0tSrA5nX25b4jw2RrE66BWrw1mxSpzHxihWB71idTgrVonz2BjF6qBXrA5nxSpxHhujWB30itXhrFglzmNjFKuDXrE6nBWrxHlsjGJ10CtWh7NilTiPjVGsDnrF6nBWrBLnsTGK1UGvWB3OilXiPDZGsTroFavDWbFKnMfGKFYHvWJ1OCtWifPYGMXqoFesDmfFKnEeG6NYHfSK1eGsWCXOY2MUq4NesTqcFavEeWyMYnXQK1aHs2KVOI+NUawO+q8rVgerKcTiQIQAsSJYHUosDkQIECuC1aHE4kCEALEiWB1KLA5ECBArgtWhxOJAhACxIlgdSiwORAgQK4LVocTiQIQAsSJYHUosDkQIECuC1aHE4kCEALEiWB1KLA5ECBArgtWhxOJAhACxIlgdSiwORAj8AOjDiGxOJiFrAAAAAElFTkSuQmCC`}
          alt=''
        />
        <br />
        Create new
      </button>
    </div>
  );
}
