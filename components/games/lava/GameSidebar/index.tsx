import Link from 'next/link';
import styles from './GameSidebar.module.scss';
import Button from '../../../Button';
import NextLink from '../../../NextLink';
import { LavaDirection } from '../../../../hooks/useLavaGameController';

type GameSidebarProps = {
  setId: string;
  setName: string;
  onReset: () => void;
  onMoveDirection: (direction: LavaDirection) => void;
  collectedCoinCount: number;
  totalCoinTileCount: number;
};

export default function GameSidebar({
  setId,
  setName,
  onReset,
  onMoveDirection,
  collectedCoinCount,
  totalCoinTileCount,
}: GameSidebarProps) {
  return (
    <div className={styles.actions}>
      <div>
        <div className={styles.coinInventory}>
          <strong>
            {collectedCoinCount !== totalCoinTileCount ? (
              <span className={styles.missingCoins}>
                {totalCoinTileCount - collectedCoinCount} coin
                {totalCoinTileCount - collectedCoinCount !== 1 ? 's' : ''} to
                collect:
              </span>
            ) : (
              <span className={styles.allCoinsCollected}>
                All coins collected!
              </span>
            )}
          </strong>
          {Array.from({ length: collectedCoinCount }).map((_, index) => (
            <div key={index} className={styles.coinIcon} />
          ))}
        </div>
      </div>
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
          jump over lava tiles, find the finish, gather coins
        </p>
      </div>

      <div>
        <NextLink
          variant='default'
          href={`/set/${setId}`}
          buttonText='Edit level'
        />
        <br />
        <Button onClick={() => onReset()} buttonText={'Reset game'} />
      </div>
    </div>
  );
}
