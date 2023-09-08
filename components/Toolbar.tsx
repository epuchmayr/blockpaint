import {
  ChangeEventHandler,
  FocusEventHandler,
  MouseEventHandler,
  useContext,
} from 'react';
import { TOOLS } from '../CONSTANTS';
import styles from './Toolbar.module.scss';

import { SessionPrefsContext } from '../pages/set/[id]/index';

function ToolSelectMenu({
  handleClickTool,
}: {
  handleClickTool: MouseEventHandler;
}) {
  const sessionPrefs = useContext(SessionPrefsContext);
  return (
    <div className={`${styles.toolSelectMenu} `}>
      {Object.keys(TOOLS).map((value, index) => {
        let isToolSelected =
          sessionPrefs.currentTool === TOOLS[value] ? 'selected' : '';

        return (
          <button
            key={`${index}-${TOOLS[value]}`}
            className={`${styles.tool} ${styles[value.toLowerCase()]} ${
              isToolSelected && styles.toolSelected
            }`}
            value={TOOLS[value].toString()}
            onClick={handleClickTool}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

export default function Toolbar({
  handleClickTool,
}: {
  handleClickTool: MouseEventHandler;
}) {
  return (
    <aside className={styles.toolbar}>
      <ToolSelectMenu handleClickTool={handleClickTool} />
    </aside>
  );
}
