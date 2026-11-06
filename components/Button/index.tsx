import { Children, MouseEventHandler } from 'react';
import styles from './Button.module.scss';

export default function Button({
  onClick,
  buttonText,
  type = 'button',
  style = 'default',
  children,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
  buttonText?: String;
  type?: String;
  style?: String;
  children?: any;
}) {
  let colors = 'bg-slate-300 border-slate-600';

  switch (style) {
    case 'warning':
      colors = 'bg-red-300 border-slate-600';
      break;
    default:
      break;
  }
  return (
    <>
      <button className={`${styles.buttonStyles} ${colors}`} onClick={onClick}>
        {buttonText}
        {children}
      </button>
    </>
  );
}
