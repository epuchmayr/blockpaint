import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildLava3DTiles,
  getSpawnPosition,
  getTileAtPosition,
  isHazardTileKind,
  isWalkableTileKind,
} from '../lib/lava3d/boardUtils';
import {
  Lava3DDirection,
  Lava3DPosition,
  Lava3DSetData,
  Lava3DTile,
} from '../lib/lava3d/types';

function getDirectionForKey(key: string): Lava3DDirection | null {
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

function getNextPosition(
  currentPosition: Lava3DPosition,
  direction: Lava3DDirection,
): Lava3DPosition {
  switch (direction) {
    case 'up':
      return { row: currentPosition.row - 1, col: currentPosition.col };
    case 'right':
      return { row: currentPosition.row, col: currentPosition.col + 1 };
    case 'down':
      return { row: currentPosition.row + 1, col: currentPosition.col };
    case 'left':
      return { row: currentPosition.row, col: currentPosition.col - 1 };
    default:
      return currentPosition;
  }
}

function getDirectionAfterTurn(
  currentDirection: Lava3DDirection,
  turnDirection: Exclude<Lava3DDirection, 'up'>,
): Lava3DDirection {
  if (turnDirection === 'down') {
    switch (currentDirection) {
      case 'up':
        return 'down';
      case 'right':
        return 'left';
      case 'down':
        return 'up';
      case 'left':
        return 'right';
      default:
        return currentDirection;
    }
  }

  const directions: Lava3DDirection[] = ['up', 'right', 'down', 'left'];
  const currentIndex = directions.indexOf(currentDirection);
  const offset = turnDirection === 'left' ? -1 : 1;
  const nextIndex = (currentIndex + offset + directions.length) % directions.length;
  return directions[nextIndex];
}

function getNextLandingTile(
  tilesByKey: Record<string, Lava3DTile>,
  currentPosition: Lava3DPosition,
  direction: Lava3DDirection,
) {
  let nextPosition = getNextPosition(currentPosition, direction);

  while (true) {
    const nextTile = getTileAtPosition(tilesByKey, nextPosition);
    if (!nextTile) {
      return null;
    }

    if (nextTile.kind !== 'void') {
      return nextTile;
    }

    nextPosition = getNextPosition(nextPosition, direction);
  }
}

export function useLava3DGameController(setData: Lava3DSetData) {
  const tiles = useMemo(() => buildLava3DTiles(setData), [setData]);
  const tilesByKey = useMemo(() => {
    return tiles.reduce<Record<string, Lava3DTile>>((acc, tile) => {
      acc[tile.id] = tile;
      return acc;
    }, {});
  }, [tiles]);
  const spawnPosition = useMemo(() => getSpawnPosition(tiles), [tiles]);

  const [playerPosition, setPlayerPosition] =
    useState<Lava3DPosition>(spawnPosition);
  const [direction, setDirection] = useState<Lava3DDirection>('up');
  const directionRef = useRef<Lava3DDirection>('up');
  const [collision, setCollision] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [coinInventory, setCoinInventory] = useState<Record<string, true>>({});

  const totalCoinTileCount = useMemo(() => {
    return tiles.filter((tile) => tile.kind === 'coin').length;
  }, [tiles]);

  const collectedCoinCount = useMemo(() => {
    return Object.keys(coinInventory).length;
  }, [coinInventory]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    setPlayerPosition(spawnPosition);
    setDirection('up');
    directionRef.current = 'up';
    setCollision(false);
    setEndGame(false);
    setCoinInventory({});
  }, [spawnPosition]);

  const resetGame = useCallback(() => {
    setPlayerPosition(spawnPosition);
    setDirection('up');
    directionRef.current = 'up';
    setCollision(false);
    setEndGame(false);
    setCoinInventory({});
  }, [spawnPosition]);

  const movePlayerInDirection = useCallback(
    (nextDirection: Lava3DDirection) => {
      if (collision || endGame) return;

      if (nextDirection !== 'up') {
        const nextFacingDirection = getDirectionAfterTurn(
          directionRef.current,
          nextDirection,
        );
        directionRef.current = nextFacingDirection;
        setDirection(nextFacingDirection);
        return;
      }

      const movementDirection = directionRef.current;

      setPlayerPosition((currentPosition) => {
        const targetTile = getNextLandingTile(
          tilesByKey,
          currentPosition,
          movementDirection,
        );
        if (!targetTile) {
          return currentPosition;
        }

        const targetPosition = { row: targetTile.row, col: targetTile.col };

        if (targetTile.kind === 'coin') {
          setCoinInventory((prevCoinInventory) => {
            if (prevCoinInventory[targetTile.id]) {
              return prevCoinInventory;
            }

            return {
              ...prevCoinInventory,
              [targetTile.id]: true,
            };
          });
        }

        if (isHazardTileKind(targetTile.kind)) {
          setCollision(true);
          return targetPosition;
        }

        if (targetTile.kind === 'goal') {
          setEndGame(true);
          return targetPosition;
        }

        if (!isWalkableTileKind(targetTile.kind)) {
          return currentPosition;
        }

        return targetPosition;
      });
    },
    [collision, endGame, tilesByKey],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const nextDirection = getDirectionForKey(event.key);
      if (!nextDirection) return;

      event.preventDefault();
      movePlayerInDirection(nextDirection);
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [movePlayerInDirection]);

  return {
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
  };
}
