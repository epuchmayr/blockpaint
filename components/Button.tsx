import { Children, MouseEventHandler } from 'react';

export default function Button({
  clickHandler,
  buttonText,
  type = 'default'
}: {
  clickHandler: MouseEventHandler<HTMLButtonElement>;
  buttonText: String;
  type?: String;
}) {
  let colors = 'bg-slate-300 border-slate-600'

  switch (type) {
    case 'warning':
    colors = 'bg-red-300 border-slate-600'
    break;
    default:
      break;
  }
  return (
    <>
      <button
        className={`border px-2 rounded-sm ${colors}`}
        onClick={clickHandler}
      >
        {buttonText}
      </button>
    </>
  );
}
