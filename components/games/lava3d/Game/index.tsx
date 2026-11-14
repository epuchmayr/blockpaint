import { useMemo } from 'react';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import GameSidebar from '../../lava/GameSidebar';
import { useLava3DGameController } from '../../../../hooks/useLava3DGameController';
import { Lava3DSetData } from '../../../../lib/lava3d/types';
import GameBoard3D from '../GameBoard3D';
import styles from './Game.module.scss';

export default function Lava3DGame({ setData }: { setData: Lava3DSetData }) {
  const {
    tiles,
    playerPosition,
    collision,
    endGame,
    direction,
    coinInventory,
    collectedCoinCount,
    totalCoinTileCount,
    movePlayerInDirection,
    resetGame,
  } = useLava3DGameController(setData);

  const collectedCoinTileIds = useMemo(() => {
    return Object.keys(coinInventory);
  }, [coinInventory]);

  if (endGame || collision) {
    const dialog = document.getElementById(
      'game-3d-dialog',
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  }

  return (
    <div className={styles.layout}>
      <dialog id='game-3d-dialog' className={styles.endGameDialog}>
        <p>
          {collision
            ? 'Oh no! You fell in the lava!'
            : 'Congratulations! YOU WIN!'}
        </p>
        <br />
        <ButtonGroup>
          <Button onClick={resetGame} command='close' commandfor='game-3d-dialog'>
            {collision ? 'Try Again' : 'Play Again'}
          </Button>
          <Button command='close' commandfor='game-3d-dialog'>
            Close
          </Button>
        </ButtonGroup>
      </dialog>

      <GameBoard3D
        tiles={tiles}
        playerPosition={playerPosition}
        direction={direction}
        collision={collision}
        endGame={endGame}
        collectedCoinTileIds={collectedCoinTileIds}
      />

      <GameSidebar
        setId={setData.id}
        setName={setData.setName}
        onReset={resetGame}
        onMoveDirection={movePlayerInDirection}
        collectedCoinCount={collectedCoinCount}
        totalCoinTileCount={totalCoinTileCount}
      />
    </div>
  );
}
