import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import Confetti from 'react-confetti';
import { KonvaEventObject } from 'konva/lib/Node';
import styles from '../Game/Game.module.scss';
import { BoardPiece } from '../../../../lib/gameTypes';

type GameBoardStageProps = {
  boardPieces: BoardPiece[];
  canvasWidth: number;
  canvasHeight: number;
  collision: boolean;
  endGame: boolean;
  playerPieceRef: React.RefObject<Konva.Rect | null>;
  onDragMove: (event: KonvaEventObject<MouseEvent>) => void;
};

export default function GameBoardStage({
  boardPieces,
  canvasWidth,
  canvasHeight,
  collision,
  endGame,
  playerPieceRef,
  onDragMove,
}: GameBoardStageProps) {
  return (
    <div className={styles.board}>
      {endGame && !collision && (
        <Confetti
          className='confetti'
          width={canvasWidth}
          height={canvasHeight}
        />
      )}
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={endGame ? 'green' : !collision ? 'white' : 'tomato'}
          />

          {boardPieces.map((piece) => {
            if (piece.type === 'player') {
              return (
                <Rect
                  key={piece.id}
                  x={piece.attrs.x}
                  y={piece.attrs.y}
                  width={piece.attrs.width}
                  height={piece.attrs.height}
                  fill={piece.color}
                  ref={playerPieceRef}
                  draggable={true}
                  onDragMove={onDragMove}
                />
              );
            }

            return (
              <Rect
                key={piece.id}
                x={piece.attrs.x}
                y={piece.attrs.y}
                width={piece.attrs.width}
                height={piece.attrs.height}
                fill={piece.color}
              />
            );
          })}

          <Text text={`Collision detected: ${collision}`} />
          <Text
            x={120}
            y={15}
            fill='#000'
            stroke='#fff'
            strokeWidth={5}
            fillAfterStrokeEnabled={true}
            fontSize={30}
            text={endGame ? 'YOU WIN!' : collision ? 'HIT DETECTED' : ''}
          />
        </Layer>
      </Stage>
    </div>
  );
}
