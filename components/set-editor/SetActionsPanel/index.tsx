import Link from 'next/link';
import NextLink from '../../NextLink';
import Button from '../../Button';

type SetActionsPanelProps = {
  setId: string;
  setName: string;
  gameSetId: string;
  onDownload: () => void;
  onReload: () => void;
  onSave: () => void;
};

export default function SetActionsPanel({
  setId,
  setName,
  gameSetId,
  onDownload,
  onReload,
  onSave,
}: SetActionsPanelProps) {
  return (
    <>
      {setId !== '' && (
        <>
          <div className='flex justify-between'>
            <div>
              <NextLink
                variant='success'
                href={`/play/maze/${gameSetId}`}
                buttonText={`Maze ${setName || '[unnamed]'}`}
              />
              <NextLink
                variant='danger'
                href={`/play/lava/${gameSetId}`}
                buttonText={`Lava ${setName || '[unnamed]'}`}
              />
            </div>
            <div>
              <Button
                onClick={() => onDownload()}
                buttonText={'Download PNG'}
              />
              <br />
              <Button
                onClick={() => onReload()}
                style={'warning'}
                buttonText={'Reload set'}
              />
            </div>
          </div>
        </>
      )}

      <Button
        onClick={() => onSave()}
        buttonText={setId !== '' ? 'Save changes' : 'Save as a new'}
      />
    </>
  );
}
