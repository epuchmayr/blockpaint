import { memo, Suspense } from 'react';
import Grid from '../../Grid';
import { Position } from '../../../lib/setEditorTypes';

type SetGridStageProps = {
  gridData: { color: string; opacity: number }[][];
  onPointerDown: (position: Position) => void;
  onPointerEnter: (position: Position) => void;
};

function SetGridStage({
  gridData,
  onPointerDown,
  onPointerEnter,
}: SetGridStageProps) {
  return (
    <div className='flex flex-auto justify-center items-center'>
      <Suspense fallback={<p>Loading set...</p>}>
        <Grid
          gridData={gridData}
          handlePointerDown={(_event: PointerEvent, position: Position) =>
            onPointerDown(position)
          }
          handlePointerEnter={(_event: PointerEvent, position: Position) =>
            onPointerEnter(position)
          }
        />
      </Suspense>
    </div>
  );
}

export default memo(SetGridStage);
