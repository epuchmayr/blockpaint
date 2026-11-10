import { Children, MouseEventHandler } from 'react';
import styles from './Button.module.scss';

export default function Button({
  onClick,
  buttonText,
  type = 'button',
  style = 'default',
  children,
  ...props
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  buttonText?: string;
  type?: string;
  style?: string;
  children?: any;
  [key: string]: any;
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
      <button
        className={`${styles.buttonStyles} ${colors}`}
        onClick={onClick}
        {...props}
      >
        {buttonText}
        {children}
      </button>
    </>
  );
}
