import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  getWorldPositionFromGridPosition,
  LAVA_3D_COLORS,
} from '../../../../lib/lava3d/boardUtils';
import {
  Lava3DDirection,
  Lava3DPosition,
  Lava3DTile,
} from '../../../../lib/lava3d/types';
import styles from './GameBoard3D.module.scss';

type GameBoard3DProps = {
  tiles: Lava3DTile[];
  playerPosition: Lava3DPosition;
  direction: Lava3DDirection;
  collision: boolean;
  endGame: boolean;
  collectedCoinTileIds: string[];
};

const TILE_SIZE = 1;

const TILE_HEIGHT_BY_KIND: Record<Lava3DTile['kind'], number> = {
  void: 0.06,
  platform: 0.9,
  lava: 1.25,
  goal: 0.7,
  spawn: 0.75,
  coin: 0.7,
  unknown: 0.2,
};

const TILE_COLOR_BY_KIND: Record<Lava3DTile['kind'], string> = {
  void: '#f5f5f5',
  platform: '#3b3b3b',
  lava: '#cf2f1f',
  goal: '#3cb371',
  spawn: '#2c6cff',
  coin: '#636363',
  unknown: '#9a9a9a',
};

function getDirectionVector(direction: Lava3DDirection) {
  switch (direction) {
    case 'up':
      return new THREE.Vector3(0, 0, -1);
    case 'right':
      return new THREE.Vector3(1, 0, 0);
    case 'down':
      return new THREE.Vector3(0, 0, 1);
    case 'left':
      return new THREE.Vector3(-1, 0, 0);
    default:
      return new THREE.Vector3(0, 0, -1);
  }
}

export default function GameBoard3D({
  tiles,
  playerPosition,
  direction,
  collision,
  endGame,
  collectedCoinTileIds,
}: GameBoard3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerTargetRef = useRef(playerPosition);
  const directionRef = useRef(direction);
  const collisionRef = useRef(collision);
  const endGameRef = useRef(endGame);
  const collectedCoinTileIdsRef = useRef(new Set(collectedCoinTileIds));

  const rowCount = useMemo(() => {
    if (!tiles.length) return 0;
    return Math.max(...tiles.map((tile) => tile.row)) + 1;
  }, [tiles]);

  const colCount = useMemo(() => {
    if (!tiles.length) return 0;
    return Math.max(...tiles.map((tile) => tile.col)) + 1;
  }, [tiles]);

  useEffect(() => {
    playerTargetRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    collisionRef.current = collision;
  }, [collision]);

  useEffect(() => {
    endGameRef.current = endGame;
  }, [endGame]);

  useEffect(() => {
    collectedCoinTileIdsRef.current = new Set(collectedCoinTileIds);
  }, [collectedCoinTileIds]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !tiles.length || !rowCount || !colCount) return;
    const mountElement = container;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#d7ecff');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    mountElement.innerHTML = '';
    mountElement.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(56, 1, 0.1, 400);
    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: '#b3cedd' });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.02;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const hemisphereLight = new THREE.HemisphereLight(
      '#dbeeff',
      '#2b2b2b',
      0.9,
    );
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight('#ffffff', 0.95);
    directionalLight.position.set(8, 16, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const voidTileTexture = new THREE.TextureLoader().load(
      '/images/textures/lava-3d/lava-tile-48.jpeg',
    );
    voidTileTexture.colorSpace = THREE.SRGBColorSpace;
    voidTileTexture.anisotropy = Math.min(
      renderer.capabilities.getMaxAnisotropy(),
      2,
    );

    const coinMeshesByTileId = new Map<string, THREE.Mesh>();
    const disposableGeometries: THREE.BufferGeometry[] = [floorGeometry];
    const disposableMaterials: THREE.Material[] = [floorMaterial];
    const geometryByTileHeight = new Map<number, THREE.BufferGeometry>();
    const materialByKind = new Map<string, THREE.MeshStandardMaterial>();

    const coinGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 28);
    const coinMaterial = new THREE.MeshStandardMaterial({
      color: LAVA_3D_COLORS.coin,
      emissive: '#8a6a00',
      emissiveIntensity: 0.45,
    });
    disposableGeometries.push(coinGeometry);
    disposableMaterials.push(coinMaterial);

    tiles.forEach((tile) => {
      const tileHeight = TILE_HEIGHT_BY_KIND[tile.kind];
      const { x, z } = getWorldPositionFromGridPosition(
        tile,
        rowCount,
        colCount,
        TILE_SIZE,
      );

      let tileGeometry = geometryByTileHeight.get(tileHeight);
      if (!tileGeometry) {
        tileGeometry = new THREE.BoxGeometry(
          TILE_SIZE * 0.94,
          tileHeight,
          TILE_SIZE * 0.94,
        );
        geometryByTileHeight.set(tileHeight, tileGeometry);
        disposableGeometries.push(tileGeometry);
      }

      const materialKey = tile.kind === 'coin' ? 'coin-base' : tile.kind;
      let tileMaterial = materialByKind.get(materialKey);
      if (!tileMaterial) {
        tileMaterial = new THREE.MeshStandardMaterial({
          color:
            tile.kind === 'coin'
              ? TILE_COLOR_BY_KIND.platform
              : TILE_COLOR_BY_KIND[tile.kind],
          map: tile.kind === 'void' ? voidTileTexture : null,
        });
        materialByKind.set(materialKey, tileMaterial);
        disposableMaterials.push(tileMaterial);
      }

      const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
      tileMesh.position.set(x, tileHeight / 2, z);
      tileMesh.castShadow = true;
      tileMesh.receiveShadow = true;
      boardGroup.add(tileMesh);

      if (tile.kind === 'coin') {
        const coinMesh = new THREE.Mesh(coinGeometry, coinMaterial);
        coinMesh.rotation.x = Math.PI / 2;
        coinMesh.position.set(x, tileHeight + 0.16, z);
        coinMesh.castShadow = true;
        boardGroup.add(coinMesh);
        coinMeshesByTileId.set(tile.id, coinMesh);
      }
    });

    const playerGeometry = new THREE.BoxGeometry(0.56, 0.78, 0.56);
    const playerMaterial = new THREE.MeshStandardMaterial({
      color: '#2d6bff',
      metalness: 0.05,
      roughness: 0.45,
    });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.castShadow = true;
    playerMesh.receiveShadow = true;
    boardGroup.add(playerMesh);
    disposableGeometries.push(playerGeometry);
    disposableMaterials.push(playerMaterial);

    const playerTarget = new THREE.Vector3();
    const cameraLookTarget = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    const cameraOffset = new THREE.Vector3();

    function resizeRenderer() {
      const width = mountElement.clientWidth || 1;
      const height = mountElement.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function setPlayerTarget(position: Lava3DPosition) {
      const world = getWorldPositionFromGridPosition(
        position,
        rowCount,
        colCount,
        TILE_SIZE,
      );
      playerTarget.set(world.x, 1.16, world.z);
    }

    setPlayerTarget(playerTargetRef.current);
    playerMesh.position.copy(playerTarget);

    const resizeObserver = new ResizeObserver(() => {
      resizeRenderer();
    });
    resizeObserver.observe(mountElement);
    resizeRenderer();

    let animationFrameId = 0;

    const animate = () => {
      setPlayerTarget(playerTargetRef.current);
      playerMesh.position.lerp(playerTarget, 0.25);

      coinMeshesByTileId.forEach((coinMesh, tileId) => {
        const isCollected = collectedCoinTileIdsRef.current.has(tileId);
        coinMesh.visible = !isCollected;

        if (!isCollected) {
          coinMesh.rotation.y += 0.05;
        }
      });

      const forward = getDirectionVector(directionRef.current);
      const isTerminalState = collisionRef.current || endGameRef.current;
      const distance = isTerminalState ? 5.3 : 4.4;
      const height = isTerminalState ? 4.3 : 3.6;

      cameraOffset.copy(forward).multiplyScalar(-distance);
      cameraOffset.y = height;

      cameraTarget.copy(playerMesh.position).add(cameraOffset);
      camera.position.lerp(cameraTarget, 0.085);

      cameraLookTarget.copy(playerMesh.position);
      cameraLookTarget.y = 0.9;
      camera.lookAt(cameraLookTarget);

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      disposableGeometries.forEach((geometry) => geometry.dispose());
      disposableMaterials.forEach((material) => material.dispose());
      voidTileTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [tiles, rowCount, colCount]);

  return (
    <div className={styles.board}>
      <div ref={containerRef} className={styles.canvas} />
    </div>
  );
}
