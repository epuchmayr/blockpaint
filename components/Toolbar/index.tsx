import { MouseEvent } from 'react';
import { TOOLS } from '../../CONSTANTS';
import styles from './Toolbar.module.scss';
import { useSessionPrefsStore } from '../../lib/sessionPrefsStore';

function ToolSelectMenu({}: {}) {
  const sessionPrefs = useSessionPrefsStore((state) => state.sessionPrefs);
  const setCurrentTool = useSessionPrefsStore((state) => state.setCurrentTool);

  function handleClickTool(event: MouseEvent<HTMLButtonElement>) {
    setCurrentTool(event.currentTarget.value);
  }

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

export default function Toolbar({}: {}) {
  return (
    <aside className={styles.toolbar}>
      <ToolSelectMenu />
    </aside>
  );
}
