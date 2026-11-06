import { useCallback, useEffect } from 'react';
import styles from '../../../pages/set/index.module.scss';

import SetLoader from '../../SetLoader/SetLoader';
import Toolbar from '../../Toolbar';
import Palettes from '../../Palettes';
import Layout from '../../Layout';
import SetMetaPanel from '../SetMetaPanel';
import SetActionsPanel from '../SetActionsPanel';
import SetGridStage from '../SetGridStage';

import { useCurrentSetStore } from '../../../lib/currentSetStore';
import { useSessionPrefsStore } from '../../../lib/sessionPrefsStore';
import { useSetsStore, SetListItem } from '../../../lib/setsStore';
import { EditableSetData, ServerSetData } from '../../../lib/setEditorTypes';
import {
  createNewSetData,
  fromServerSetData,
  saveSetData,
} from '../../../lib/setEditorService';
import { useSetEditor } from '../../../hooks/useSetEditor';
import { useSetCanvasExport } from '../../../hooks/useSetCanvasExport';

type SetEditorPageProps = {
  initialSetData?: ServerSetData;
  setsData: SetListItem[];
};

export default function SetEditorPage({
  initialSetData,
  setsData,
}: SetEditorPageProps) {
  const setCurrentSetData = useCurrentSetStore(
    (state) => state.setCurrentSetData,
  );
  const currentSetId = useSessionPrefsStore(
    (state) => state.sessionPrefs.currentSetId,
  );
  const setCurrentColor = useSessionPrefsStore(
    (state) => state.setCurrentColor,
  );
  const setCurrentSetId = useSessionPrefsStore(
    (state) => state.setCurrentSetId,
  );
  const addColorToHistory = useSessionPrefsStore(
    (state) => state.addColorToHistory,
  );
  const setSetsData = useSetsStore((state) => state.setSetsData);

  const initialEditableSetData: EditableSetData = initialSetData
    ? fromServerSetData(initialSetData)
    : createNewSetData();

  const {
    setData,
    replaceSetData,
    updateSetField,
    handlePointerDown,
    handlePointerEnter,
    isHeldActive,
    setIsHeldActive,
  } = useSetEditor({
    initialSetData: initialEditableSetData,
  });

  const { canvasRef, makeEncodedImage, requestDownload } = useSetCanvasExport(
    setData.gridData,
  );

  useEffect(() => {
    setSetsData(setsData || []);
  }, [setsData, setSetsData]);

  useEffect(() => {
    setCurrentSetData({
      id: setData.id,
      gridData: setData.gridData,
      gridWidth: Number(setData.gridWidth),
      gridHeight: Number(setData.gridHeight),
      setName: setData.setName || '',
    });
  }, [setData, setCurrentSetData]);

  useEffect(() => {
    if (initialSetData?._id) {
      setCurrentSetId(initialSetData._id);
    }
  }, [initialSetData?._id, setCurrentSetId]);

  function handleLoadNew() {
    replaceSetData(createNewSetData());
    setCurrentSetId('');
  }

  const handlePointerDownStable = useCallback(handlePointerDown, [
    handlePointerDown,
  ]);
  const handlePointerEnterStable = useCallback(handlePointerEnter, [
    handlePointerEnter,
  ]);

  async function handleSave() {
    const encodedImage = makeEncodedImage();
    if (!encodedImage) return;

    const result = await saveSetData(setData, encodedImage);
    if (result.insertedId) {
      setCurrentSetId(result.insertedId);
      replaceSetData({
        ...setData,
        id: result.insertedId,
      });
    }
  }

  function handleReload() {
    if (!initialSetData) return;
    replaceSetData(fromServerSetData(initialSetData));
    setCurrentSetId(initialSetData._id);
  }

  return (
    <Layout>
      <SetLoader handleLoadNew={handleLoadNew} />

      <div
        className={`${styles.main} flex-col overflow-auto md:flex-row`}
        onPointerEnter={() => setIsHeldActive(false)}
        onPointerDown={() => setIsHeldActive(true)}
        onPointerUp={() => setIsHeldActive(false)}
      >
        <Toolbar />

        <SetGridStage
          gridData={setData.gridData}
          onPointerDown={handlePointerDownStable}
          onPointerEnter={handlePointerEnterStable}
        />

        <aside className={styles.optionsMenu}>
          <SetMetaPanel
            setData={setData}
            onUpdateField={updateSetField}
            onColorChange={setCurrentColor}
            onColorBlur={addColorToHistory}
            canvasRef={canvasRef}
          />

          <SetActionsPanel
            setId={currentSetId}
            setName={setData.setName}
            gameSetId={setData.id || initialSetData?._id || ''}
            onDownload={requestDownload}
            onReload={handleReload}
            onSave={handleSave}
          />

          <Palettes />
        </aside>
      </div>
    </Layout>
  );
}
