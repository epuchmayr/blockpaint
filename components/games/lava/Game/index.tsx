import { useCurrentSetStore } from '../../../../lib/currentSetStore';
import { useLavaGameController } from '../../../../hooks/useLavaGameController';
import GameBoardStage from '../GameBoardStage';
import GameSidebar from '../GameSidebar';
import styles from './Game.module.scss';
import Button from '@/components/Button';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';

export default function Game() {
  const setData = useCurrentSetStore((state) => state.currentSetData);
  const {
    boardPieces,
    collision,
    endGame,
    canvasWidth,
    canvasHeight,
    playerPieceRef,
    handleDragMove,
    resetGame,
    direction,
    movePlayerInDirection,
    collectedCoinCount,
    totalCoinTileCount,
  } = useLavaGameController(setData);

  if (endGame || collision) {
    const dialog = document.getElementById(
      'game-dialog',
    ) as HTMLDialogElement | null;
    dialog?.showModal();
  }

  return (
    <>
      <div>
        <dialog id='game-dialog' className={styles.endGameDialog}>
          <p>
            {collision
              ? 'Oh no! You fell in the lava!'
              : 'Congratulations! YOU WIN!'}
          </p>
          <br />
          <ButtonGroup>
            <Button
              onClick={resetGame}
              command='close'
              commandfor='game-dialog'
            >
              {collision ? 'Try Again' : 'Play Again'}
            </Button>
            <Button command='close' commandfor='game-dialog'>
              Close
            </Button>
          </ButtonGroup>
        </dialog>
        <GameBoardStage
          boardPieces={boardPieces}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          collision={collision}
          endGame={endGame}
          playerPieceRef={playerPieceRef}
          onDragMove={handleDragMove}
          direction={direction}
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
    </>
  );
}
