import { Children, MouseEventHandler } from 'react';
import styles from './ButtonGroup.module.scss';

export default function ButtonGroup({ children }: { children?: any }) {
  return <div className={styles.buttonGroup}>{children}</div>;
}
