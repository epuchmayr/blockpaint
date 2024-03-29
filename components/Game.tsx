import {
  useContext,
  ReactElement,
  useState,
  useEffect,
  useRef,
  MouseEventHandler,
} from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import Confetti from 'react-confetti';
import styles from './Game.module.scss';
import Link from 'next/link';

import Button from './Button';

import { SetDataContext } from '../pages';
import { KonvaEventObject } from 'konva/lib/Node';

export default function Game() {
  const playerPieceReact = useRef<Konva.Rect>(null);

  const setData = useContext(SetDataContext);

  const [collision, setCollision] = useState(false);
  const [endGame, setEndGame] = useState(false);

  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState({width: 375, height: 375})

  const canvasWidth = Math.min(600, windowSize.width);
  const canvasHeight = Math.min(600, windowSize.width);

  const blockData = {
    width: canvasWidth / [setData.gridData][0].length,
    height: canvasHeight / setData.gridData.length,
  };

  interface attributes {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  function haveIntersection(r1: attributes, r2: attributes) {
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }

  /////////////////////////////

  let goal: ReactElement[] = [];
  let pieces: ReactElement[] = [];
  let level: ReactElement[] = [];
  let background: ReactElement[] = [];

  function renderBoard() {
    setData.gridData.map((row: { color: string }[], index: number) => {
      for (const block in row) {
        let numBlock = parseInt(block);
        let currentBlock = row[numBlock];
        let sizeX = blockData.width;
        let sizeY = blockData.height;
        let blockX = numBlock * sizeX;
        let blockY = index * sizeY;
        let currentElement: ReactElement;

        if (currentBlock.color === '#0000ff') {
          currentElement = (
            <Rect
              x={blockX + 1}
              y={blockY + 1}
              width={sizeX - 2}
              height={sizeY - 2}
              fill={currentBlock.color}
              ref={playerPieceReact}
              draggable={true}
              onDragMove={handleDragMove}
            />
          );
        } else {
          currentElement = (
            <Rect
              x={blockX}
              y={blockY}
              width={sizeX}
              height={sizeY}
              fill={currentBlock.color}
            />
          );
        }

        switch (currentBlock.color) {
          case '#0000ff':
            pieces.push(currentElement);
            break;
          case '#ff0000':
            goal.push(currentElement);
            break;
          case '#000000':
            level.push(currentElement);
            break;
          default:
            background.push(currentElement);
        }
      }
    });
    return [...background, ...level, ...goal, ...pieces];
  }

  function checkCollision(targetAttributes: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    level.forEach((element) => {
      if (haveIntersection(targetAttributes, element.props)) setCollision(true);
    });
    goal.forEach((element) => {
      if (haveIntersection(targetAttributes, element.props)) setEndGame(true);
    });
  }

  function handleDragMove(e: KonvaEventObject<MouseEvent>) {
    if (collision || endGame) {
      e.target.x(-20);
      e.target.y(0);
      return;
    }
    checkCollision(e.target.attrs);
    e.target.x(minMaxCanvasSize(e.target.x(), 'horizontal'));
    e.target.y(minMaxCanvasSize(e.target.y(), 'vertical'));
  }

  function minMaxCanvasSize(targetPosition: number, direction: string) {
    return direction === 'horizontal'
      ? Math.min(
          Math.max(targetPosition, 0 + 1),
          canvasWidth - blockData.width + 1
        )
      : Math.min(
          Math.max(targetPosition, 0 + 1),
          canvasHeight - blockData.height + 1
        );
  }

  useEffect(() => {
    if (collision || endGame) {
      playerPieceReact.current?.to({
        x: -20,
        y: 0,
        duration: 0,
      });
      return;
    }
    let isMoving: Boolean = false;

    function keycodeReact(event: KeyboardEvent) {
      // console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`, isMoving, playerPieceReact)
      if (isMoving) return;
      isMoving = true;
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          playerPieceReact.current?.to({
            y: minMaxCanvasSize(
              playerPieceReact.current.attrs.y - blockData.height,
              'vertical'
            ),
            onFinish: () => {
              isMoving = false;
              checkCollision(playerPieceReact.current?.attrs);
            },
            duration: 0.05,
          });
          break;
        case 'ArrowLeft':
        case 'a':
          playerPieceReact.current?.to({
            x: minMaxCanvasSize(
              playerPieceReact.current.attrs.x - blockData.height,
              'horizontal'
            ),
            onFinish: () => {
              isMoving = false;
              checkCollision(playerPieceReact.current?.attrs);
            },
            duration: 0.05,
          });
          break;
        case 'ArrowDown':
        case 's':
          playerPieceReact.current?.to({
            y: minMaxCanvasSize(
              playerPieceReact.current.attrs.y + blockData.height,
              'vertical'
            ),
            onFinish: () => {
              isMoving = false;
              checkCollision(playerPieceReact.current?.attrs);
            },
            duration: 0.05,
          });
          break;
        case 'ArrowRight':
        case 'd':
          playerPieceReact.current?.to({
            x: minMaxCanvasSize(
              playerPieceReact.current.attrs.x + blockData.height,
              'horizontal'
            ),
            onFinish: () => {
              isMoving = false;
              checkCollision(playerPieceReact.current?.attrs);
            },
            duration: 0.05,
          });
          break;
        default:
          break;
      }
      event.preventDefault();
    }

    window.addEventListener('keydown', keycodeReact, true);
    return () => {
      window.removeEventListener('keydown', keycodeReact, true);
    };
  }, [collision, endGame]);

  useEffect(() => {
    setPlayerPosition({
      x: playerPieceReact.current?.attrs.x,
      y: playerPieceReact.current?.attrs.y,
    });
    setWindowSize(prev => ({...prev, width: window.innerWidth}))
  }, []);

  function resetGame() {
    setCollision(false);
    setEndGame(false);
    console.log(playerPosition);
    playerPieceReact.current?.to({
      x: playerPosition.x,
      y: playerPosition.y,
      duration: 0,
    });
  }

  return (
    <>
      <div className='flex flex-col justify-center md:flex-row'>
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
              {renderBoard()}
              <Text text={`Collision detected: ${collision}`} />

              <Text
                x={120}
                y={15}
                fill='#000'
                stroke='#fff'
                strokeWidth={5}
                fillAfterStrokeEnabled={true}
                fontSize={30}
                text={endGame ? `YOU WIN!` : collision ? `HIT DETECTED` : ``}
              />
            </Layer>
          </Stage>
        </div>
        <div className={styles.actions}>
          <div>
            <strong>Name:</strong> {setData.setName || `no name`}
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

          <Link className="border inline-block px-2 mb-3 rounded-sm border-slate-300 bg-slate-300" href={`/set/${setData.id}`} as={`/set/${setData.id}`}>
            Edit level
          </Link>
          <br />
          <Button onClick={resetGame} buttonText={'Reset game'} />
        </div>
      </div>
    </>
  );
}
