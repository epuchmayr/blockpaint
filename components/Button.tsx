import { Children, MouseEventHandler } from 'react';

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
      <button className={`border px-2 rounded-sm ${colors}`} onClick={onClick}>
        {buttonText}
        {children}
      </button>
    </>
  );
}
