import { Children, MouseEventHandler } from "react";


export default function Button({clickHandler, buttonText}: {
  clickHandler: MouseEventHandler<HTMLButtonElement>;
  buttonText: String
}) {

  return (
    <>
      <button
      className="border px-2 rounded-sm bg-red-300 border-slate-600"
      onClick={clickHandler}>{buttonText}</button>
    </>
  );
}
