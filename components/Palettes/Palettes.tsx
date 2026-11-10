import { MouseEvent } from 'react';
import styles from './Palettes.module.scss';
import Palette from '../Palette';
import { SWATCHES } from '../../CONSTANTS';
import { useSessionPrefsStore } from '../../lib/sessionPrefsStore';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#components/ui/accordion';

export default function Palettes() {
  const colorHistory = useSessionPrefsStore(
    (state) => state.sessionPrefs.colorHistory,
  );
  const setCurrentColor = useSessionPrefsStore(
    (state) => state.setCurrentColor,
  );
  const addColorToHistory = useSessionPrefsStore(
    (state) => state.addColorToHistory,
  );

  function handleChangeColor(event: MouseEvent<HTMLButtonElement>) {
    const targetColor = event.currentTarget.value;
    setCurrentColor(targetColor);
    addColorToHistory(targetColor);
  }

  return (
    <div className={styles.palettes}>
      <Palette
        title={'Colour History'}
        swatches={colorHistory}
        clickHandler={handleChangeColor}
      />
      <Accordion defaultValue={[`item-0`]}>
        {SWATCHES.map((swatch, index) => {
          return (
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>{swatch.name}</AccordionTrigger>
              <AccordionContent>
                <Palette
                  key={index}
                  swatches={swatch.colors}
                  clickHandler={handleChangeColor}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
