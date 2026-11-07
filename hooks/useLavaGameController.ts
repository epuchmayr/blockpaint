import { useEffect, useMemo, useRef, useState } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { CurrentSetData } from '../lib/currentSetStore';
import { Attributes } from '../lib/gameTypes';
import {
  buildBoardPieces,
  getCanvasDimensions,
  getSpawnPosition,
} from '../lib/lava/gameBoardService';

export type LavaDirection = 'up' | 'right' | 'down' | 'left';

function haveIntersection(r1: Attributes, r2: Attributes) {
  return !(
    r2.x > r1.x + r1.width ||
    r2.x + r2.width < r1.x ||
    r2.y > r1.y + r1.height ||
    r2.y + r2.height < r1.y
  );
}

function getDirectionForKey(key: string): LavaDirection | null {
  const normalizedKey = key.toLowerCase();

  switch (normalizedKey) {
    case 'arrowup':
    case 'w':
      return 'up';
    case 'arrowright':
    case 'd':
      return 'right';
    case 'arrowdown':
    case 's':
      return 'down';
    case 'arrowleft':
    case 'a':
      return 'left';
    default:
      return null;
  }
}

export function useLavaGameController(setData: CurrentSetData) {
  const playerPieceRef = useRef<Konva.Rect>(null);
  const isMovingRef = useRef(false);
  const [collision, setCollision] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [direction, setDirection] = useState<LavaDirection>('up');
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
    directionType: 'horizontal' | 'vertical',
  ) {
    return directionType === 'horizontal'
      ? Math.min(Math.max(targetPosition, 1), canvasWidth - blockData.width + 1)
      : Math.min(
          Math.max(targetPosition, 1),
          canvasHeight - blockData.height + 1,
        );
  }

  function isValidLandingTile(color: string | undefined) {
    const normalizedColor = color?.toLowerCase();
    return (
      normalizedColor === '#000000' ||
      normalizedColor === '#00ff00' ||
      normalizedColor === '#ff0000'
    );
  }

  function getTileColorAtPosition(x: number, y: number) {
    const gridCols = setData.gridData[0]?.length || 0;
    const gridRows = setData.gridData.length || 0;

    if (!gridCols || !gridRows) return undefined;

    const col = Math.floor(x / blockData.width);
    const row = Math.floor(y / blockData.height);

    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols) {
      return undefined;
    }

    return setData.gridData[row]?.[col]?.color?.toLowerCase();
  }

  function isHazardTileAtPosition(x: number, y: number) {
    return getTileColorAtPosition(x, y) === '#ff0000';
  }

  function isBlackTileAtPosition(x: number, y: number) {
    return getTileColorAtPosition(x, y) === '#000000';
  }

  function getNextBlackTileTarget(playerRef: Konva.Rect): Attributes | null {
    const startCol = Math.floor(
      (playerRef.attrs.x + playerRef.attrs.width / 2) / blockData.width,
    );
    const startRow = Math.floor(
      (playerRef.attrs.y + playerRef.attrs.height / 2) / blockData.height,
    );
    const gridCols = setData.gridData[0]?.length || 0;
    const gridRows = setData.gridData.length || 0;

    if (!gridCols || !gridRows) return null;

    const directionStep =
      direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
    const rowStep = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;

    for (let step = 1; step <= Math.max(gridCols, gridRows); step++) {
      const col = startCol + directionStep * step;
      const row = startRow + rowStep * step;

      if (row < 0 || row >= gridRows || col < 0 || col >= gridCols) {
        break;
      }

      const tileColor = setData.gridData[row]?.[col]?.color;

      if (tileColor === '#ffffff') {
        continue;
      }

      if (isValidLandingTile(tileColor)) {
        return {
          x: col * blockData.width + 1,
          y: row * blockData.height + 1,
          width: blockData.width - 2,
          height: blockData.height - 2,
        };
      }

      break;
    }

    return null;
  }

  function checkCollision(targetAttributes: Attributes) {
    if (isHazardTileAtPosition(targetAttributes.x, targetAttributes.y)) {
      setCollision(true);
      return;
    }

    const isMoveOnBlackTile = isBlackTileAtPosition(
      targetAttributes.x,
      targetAttributes.y,
    );

    if (!isMoveOnBlackTile) {
      if (
        walls.some((wall) => haveIntersection(targetAttributes, wall.attrs))
      ) {
        setCollision(true);
      }
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
    setDirection('up');

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

  function movePlayerInDirection(nextDirection: LavaDirection) {
    if (isMovingRef.current || collision || endGame || !playerPieceRef.current) {
      return;
    }

    if (nextDirection !== direction) {
      setDirection(nextDirection);
      return;
    }

    isMovingRef.current = true;

    const playerRef = playerPieceRef.current;
    const jumpTarget = getNextBlackTileTarget(playerRef);

    if (!jumpTarget) {
      isMovingRef.current = false;
      return;
    }

    playerRef.to({
      x: jumpTarget.x,
      y: jumpTarget.y,
      onFinish: () => {
        isMovingRef.current = false;
        checkCollision(playerRef.attrs as Attributes);
      },
      duration: 0.05,
    });
  }

  useEffect(() => {
    if (collision || endGame) {
      playerPieceRef.current?.to({
        x: -20,
        y: 0,
        duration: 0,
      });
      return;
    }

    function keycodeReact(event: KeyboardEvent) {
      const nextDirection = getDirectionForKey(event.key);
      if (!nextDirection) return;

      event.preventDefault();
      movePlayerInDirection(nextDirection);
    }

    window.addEventListener('keydown', keycodeReact, true);
    return () => {
      window.removeEventListener('keydown', keycodeReact, true);
    };
  }, [collision, endGame, direction, movePlayerInDirection]);

  return {
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
  };
}
