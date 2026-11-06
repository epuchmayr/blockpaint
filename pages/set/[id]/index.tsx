import { GetServerSideProps } from 'next';
import { getSetData, getSetsData } from '../../../lib/set';
import SetEditorPage from '../../../components/set-editor/SetEditorPage';
import { ServerSetData } from '../../../lib/setEditorTypes';
import { SetListItem } from '../../../lib/setsStore';

export default function Set({
  setData,
  setsData,
}: {
  setData: ServerSetData;
  setsData: SetListItem[];
}) {
  return (
    <SetEditorPage
      key={setData?._id ?? 'new'}
      initialSetData={setData}
      setsData={setsData}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const setData = await getSetData(params?.id as string);
  const setsData = await getSetsData();
  return {
    props: {
      setData,
      setsData,
    },
  };
};
