import styles from './GameSidebar.module.scss';
import Button from '../../../Button';
import NextLink from '../../../NextLink';
import { MazeDirection } from '../../../../hooks/useGameController';

type GameSidebarProps = {
  setId: string;
  setName: string;
  onReset: () => void;
  onMoveDirection: (direction: MazeDirection) => void;
};

export default function GameSidebar({
  setId,
  setName,
  onReset,
  onMoveDirection,
}: GameSidebarProps) {
  return (
    <div className={styles.actions}>
      <div className={styles.controls}>
        <Button onClick={() => onMoveDirection('up')} buttonText={'↑'} />
        <div>
          <Button onClick={() => onMoveDirection('left')} buttonText={'←'} />
          <Button onClick={() => onMoveDirection('down')} buttonText={'↓'} />
          <Button onClick={() => onMoveDirection('right')} buttonText={'→'} />
        </div>
      </div>
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
