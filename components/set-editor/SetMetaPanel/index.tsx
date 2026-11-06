import { FocusEvent, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { EditableSetData } from '../../../lib/setEditorTypes';
import { useSessionPrefsStore } from '../../../lib/sessionPrefsStore';

type SetMetaPanelProps = {
  setData: EditableSetData;
  onUpdateField: (name: string, value: string) => void;
  onColorChange: (value: string) => void;
  onColorBlur: (value: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function SetMetaPanel({
  setData,
  onUpdateField,
  onColorChange,
  onColorBlur,
  canvasRef,
}: SetMetaPanelProps) {
  const currentColor = useSessionPrefsStore(
    (state) => state.sessionPrefs.currentColor,
  );
  const rafIdRef = useRef<number | null>(null);
  const pendingColorRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (pendingColorRef.current !== null) {
      onColorChange(pendingColorRef.current);
      pendingColorRef.current = null;
    }

    onColorBlur(event.target.value);
  }

  function handleColorInput(value: string) {
    pendingColorRef.current = value;

    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (pendingColorRef.current === null) return;
      onColorChange(pendingColorRef.current);
      pendingColorRef.current = null;
    });
  }

  return (
    <div className='p-2'>
      <div className='text-sm'>
        Name:&nbsp;
        <input
          name='setName'
          value={setData.setName}
          placeholder='untitled'
          onChange={(e) => onUpdateField('setName', e.target.value)}
        />
        <br />
        Created:{' '}
        {format(new Date(setData.createdDate), 'MMM dd, yyyy - h:mm:ss aa')}
        <br />
        Updated:{' '}
        {format(new Date(setData.lastUpdate), 'MMM dd, yyyy - h:mm:ss aa')}
        <div className='flex justify-between'>
          <span>Creator: {setData.creator || '[unknown]'}</span>
          <span>
            Dimensions: {setData.gridWidth} x {setData.gridHeight}
          </span>
        </div>
      </div>

      <div className='h-0 w-0 overflow-hidden'>
        <p>{`${setData.gridWidth} x ${setData.gridHeight}`}</p>
        <canvas ref={canvasRef} id='canvas' width='500' height='500'>
          canvas
        </canvas>
      </div>

      <br />
      <input
        className='foregroundColour'
        name='color'
        type='color'
        value={currentColor}
        onChange={(e) => handleColorInput(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
}
