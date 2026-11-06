import { useEffect, useRef, useState } from 'react';
import { GridData } from '../lib/setEditorTypes';

export function useSetCanvasExport(gridData: GridData) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadImage, setDownloadImage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !gridData.length || !gridData[0]?.length) return;

    gridData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const sizeX = canvas.width / row.length;
        const sizeY = canvas.height / gridData.length;
        const blockX = colIndex * sizeX;
        const blockY = rowIndex * sizeY;
        ctx.fillStyle = cell.color;
        ctx.fillRect(blockX, blockY, blockX + sizeX, blockY + sizeY);
      });
    });
  }, [gridData]);

  function makeEncodedImage() {
    const canvas = canvasRef.current;
    return canvas ? canvas.toDataURL() : '';
  }

  function requestDownload() {
    setDownloadImage(true);
  }

  useEffect(() => {
    if (!downloadImage) return;

    const encodedImage = makeEncodedImage();
    if (!encodedImage) {
      setDownloadImage(false);
      return;
    }

    const element = document.createElement('a');
    element.setAttribute('href', encodedImage);
    element.setAttribute('download', 'file');

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadImage(false);
  }, [downloadImage]);

  return {
    canvasRef,
    makeEncodedImage,
    requestDownload,
  };
}
