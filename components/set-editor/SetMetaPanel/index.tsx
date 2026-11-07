import { FocusEvent, useEffect, useRef } from 'react';
import { EditableSetData } from '../../../lib/setEditorTypes';
import { useSessionPrefsStore } from '../../../lib/sessionPrefsStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../ui/accordion';

const utcDateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
});

function formatUtcDate(value: string | null | undefined) {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return utcDateTimeFormatter.format(date);
}

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
        <div className='flex justify-between'>
          <span>
            Name:&nbsp;
            <input
              className='w-20'
              name='setName'
              value={setData.setName}
              placeholder='untitled'
              onChange={(e) => onUpdateField('setName', e.target.value)}
            />
          </span>
          <span>Creator: {setData.creator || '[unknown]'}</span>
        </div>
        <Accordion>
          <AccordionItem value='item-1'>
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>
              <div className='text-sm'>
                Created: {formatUtcDate(setData.createdDate)}
                <br />
                Updated: {formatUtcDate(setData.lastUpdate)}
                <div className='flex justify-between'>
                  <span>Creator: {setData.creator || '[unknown]'}</span>
                  <span>
                    Dimensions: {setData.gridWidth} x {setData.gridHeight}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className='h-0 w-0 overflow-hidden'>
          <p>{`${setData.gridWidth} x ${setData.gridHeight}`}</p>
          <canvas ref={canvasRef} id='canvas' width='500' height='500'>
            canvas
          </canvas>
        </div>
      </div>
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
