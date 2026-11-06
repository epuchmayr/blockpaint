import Link from 'next/link';
import styles from '../Game/Game.module.scss';
import Button from '../../../Button';
import NextLink from '../../../NextLink';

type GameSidebarProps = {
  setId: string;
  setName: string;
  onReset: () => void;
};

export default function GameSidebar({
  setId,
  setName,
  onReset,
}: GameSidebarProps) {
  return (
    <div className={styles.actions}>
      <div>
        <strong>Name:</strong> {setName || 'no name'}
      </div>
      <div>
        <strong>Objective:</strong>
        <br />
        <p className='mb-3'>
          move blue to red
          <br />
          blue must not touch black
          <br />
          drag blue or use arrow keys
        </p>
      </div>

      <NextLink
        variant='default'
        href={`/set/${setId}`}
        buttonText='Edit level'
      />
      <br />
      <Button onClick={() => onReset()} buttonText={'Reset game'} />
    </div>
  );
}
