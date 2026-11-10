import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import Confetti from 'react-confetti';
import { KonvaEventObject } from 'konva/lib/Node';
import styles from './GameBoardStage.module.scss';
import { BoardPiece } from '../../../../lib/gameTypes';
import { LavaDirection } from '../../../../hooks/useLavaGameController';

type GameBoardStageProps = {
  boardPieces: BoardPiece[];
  canvasWidth: number;
  canvasHeight: number;
  collision: boolean;
  endGame: boolean;
  playerPieceRef: React.RefObject<Konva.Rect | null>;
  onDragMove: (event: KonvaEventObject<MouseEvent>) => void;
  direction: LavaDirection;
};

const directionAngles: Record<LavaDirection, number> = {
  up: Math.PI,
  right: -Math.PI / 2,
  down: 0,
  left: Math.PI / 2,
};

export default function GameBoardStage({
  boardPieces,
  canvasWidth,
  canvasHeight,
  collision,
  endGame,
  playerPieceRef,
  onDragMove,
  direction,
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
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        className={styles.stageStyles}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={endGame ? 'green' : !collision ? 'darkorange' : 'tomato'}
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
                  sceneFunc={(context, shape) => {
                    const width = shape.width();
                    const height = shape.height();
                    const arrowLength = Math.min(width, height) * 0.45;

                    const fillColor = (shape.getAttr('fill') ??
                      '#0000ff') as string;

                    context.beginPath();
                    context.rect(0, 0, width, height);
                    context.fillStyle = fillColor;
                    context.fill();

                    context.save();
                    context.translate(width / 2, height / 2);
                    context.rotate(directionAngles[direction]);
                    context.beginPath();
                    context.moveTo(0, -arrowLength);
                    context.lineTo(arrowLength * 0.2, -arrowLength * 0.2);
                    context.lineTo(arrowLength * 0.2, arrowLength * 0.18);
                    context.lineTo(arrowLength * 0.45, arrowLength * 0.18);
                    context.lineTo(0, arrowLength * 0.75);
                    context.lineTo(-arrowLength * 0.45, arrowLength * 0.18);
                    context.lineTo(-arrowLength * 0.2, arrowLength * 0.18);
                    context.lineTo(-arrowLength * 0.2, -arrowLength * 0.2);
                    context.closePath();
                    context.fillStyle = 'rgba(255,255,255,0.95)';
                    context.fill();
                    context.restore();
                  }}
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
                opacity={piece.color === '#ffffff' ? 0 : 1}
              />
            );
          })}

          <Text text={`Collision detected: ${collision}`} />
          <Text
            x={canvasWidth / 2}
            y={canvasHeight / 2}
            // offsetX={120}
            fill='#000'
            stroke='#fff'
            strokeWidth={5}
            fillAfterStrokeEnabled={true}
            fontSize={60}
            text={endGame ? 'YOU WIN!' : collision ? 'HIT DETECTED' : ''}
          />
        </Layer>
      </Stage>
    </div>
  );
}
