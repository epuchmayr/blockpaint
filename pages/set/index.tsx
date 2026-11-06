import { GetServerSideProps } from 'next';
import { getSetsData } from '../../lib/set';
import SetEditorPage from '../../components/set-editor/SetEditorPage';
import { SetListItem } from '../../lib/setsStore';

export default function Set({ setsData }: { setsData: SetListItem[] }) {
  return <SetEditorPage setsData={setsData} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const setsData = await getSetsData();
  return {
    props: {
      setsData,
    },
  };
};
