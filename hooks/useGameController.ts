import { useEffect, useMemo, useRef, useState } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CurrentSetData } from '../lib/currentSetStore';
import { Attributes } from '../lib/gameTypes';
import {
  buildBoardPieces,
  getCanvasDimensions,
  getSpawnPosition,
} from '../lib/maze/gameBoardService';

function haveIntersection(r1: Attributes, r2: Attributes) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

export function useGameController(setData: CurrentSetData) {
  const playerPieceRef = useRef<Konva.Rect>(null);
  const [collision, setCollision] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [windowWidth, setWindowWidth] = useState(375);

  const { canvasWidth, canvasHeight } = getCanvasDimensions(windowWidth);

  const boardPieces = useMemo(() => {
    return buildBoardPieces(setData, canvasWidth, canvasHeight);
  }, [setData, canvasWidth, canvasHeight]);

  const walls = useMemo(() => {
    return boardPieces.filter((piece) => piece.type === 'wall');
  }, [boardPieces]);

  const goals = useMemo(() => {
    return boardPieces.filter((piece) => piece.type === 'goal');
  }, [boardPieces]);

  const player = useMemo(() => {
    return boardPieces.find((piece) => piece.type === 'player');
  }, [boardPieces]);

  const blockData = useMemo(() => {
    const gridCols = setData.gridData[0]?.length || 1;
    const gridRows = setData.gridData.length || 1;
    return {
      width: canvasWidth / gridCols,
      height: canvasHeight / gridRows,
    };
  }, [setData, canvasWidth, canvasHeight]);

  function minMaxCanvasSize(
    targetPosition: number,
    direction: 'horizontal' | 'vertical',
  ) {
    return direction === 'horizontal'
      ? Math.min(Math.max(targetPosition, 1), canvasWidth - blockData.width + 1)
      : Math.min(
          Math.max(targetPosition, 1),
          canvasHeight - blockData.height + 1,
        );
  }

  function checkCollision(targetAttributes: Attributes) {
    if (walls.some((wall) => haveIntersection(targetAttributes, wall.attrs))) {
      setCollision(true);
    }

    if (goals.some((goal) => haveIntersection(targetAttributes, goal.attrs))) {
      setEndGame(true);
    }
  }

  function handleDragMove(event: KonvaEventObject<MouseEvent>) {
    if (collision || endGame) {
      event.target.x(-20);
      event.target.y(0);
      return;
    }

    event.target.x(minMaxCanvasSize(event.target.x(), 'horizontal'));
    event.target.y(minMaxCanvasSize(event.target.y(), 'vertical'));

    checkCollision(event.target.attrs as Attributes);
  }

  function resetGame() {
    setCollision(false);
    setEndGame(false);

    const spawn = getSpawnPosition(setData, canvasWidth, canvasHeight);
    playerPieceRef.current?.to({
      x: spawn.x,
      y: spawn.y,
      duration: 0,
    });
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setWindowWidth(window.innerWidth);

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (collision || endGame) {
      playerPieceRef.current?.to({
        x: -20,
        y: 0,
        duration: 0,
      });
      return;
    }

    let isMoving = false;

    function keycodeReact(event: KeyboardEvent) {
      if (isMoving || !playerPieceRef.current) return;
      isMoving = true;

      const playerRef = playerPieceRef.current;
      let nextX = playerRef.attrs.x;
      let nextY = playerRef.attrs.y;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          nextY = minMaxCanvasSize(
            playerRef.attrs.y - blockData.height,
            'vertical',
          );
          break;
        case 'ArrowLeft':
        case 'a':
          nextX = minMaxCanvasSize(
            playerRef.attrs.x - blockData.height,
            'horizontal',
          );
          break;
        case 'ArrowDown':
        case 's':
          nextY = minMaxCanvasSize(
            playerRef.attrs.y + blockData.height,
            'vertical',
          );
          break;
        case 'ArrowRight':
        case 'd':
          nextX = minMaxCanvasSize(
            playerRef.attrs.x + blockData.height,
            'horizontal',
          );
          break;
        default:
          isMoving = false;
          return;
      }

      playerRef.to({
        x: nextX,
        y: nextY,
        onFinish: () => {
          isMoving = false;
          checkCollision(playerRef.attrs as Attributes);
        },
        duration: 0.05,
      });

      event.preventDefault();
    }

    window.addEventListener('keydown', keycodeReact, true);
    return () => {
      window.removeEventListener('keydown', keycodeReact, true);
    };
  }, [
    collision,
    endGame,
    blockData.height,
    blockData.width,
    canvasHeight,
    canvasWidth,
  ]);

  return {
    boardPieces,
    player,
    collision,
    endGame,
    canvasWidth,
    canvasHeight,
    playerPieceRef,
    handleDragMove,
    resetGame,
  };
}
