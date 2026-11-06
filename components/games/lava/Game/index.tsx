import { useCurrentSetStore } from '../../../../lib/currentSetStore';
import { useLavaGameController } from '../../../../hooks/useLavaGameController';
import GameBoardStage from '../GameBoardStage';
import GameSidebar from '../GameSidebar';

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
  } = useLavaGameController(setData);

  return (
    <>
      <div className='flex flex-col justify-center md:flex-row'>
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
        />
      </div>
    </>
  );
}
