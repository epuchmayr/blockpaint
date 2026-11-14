import { GetServerSideProps } from 'next';
import Layout from '../../../../components/Layout';
import Lava3DGame from '../../../../components/games/lava3d/Game';
import { getSetData } from '../../../../lib/set';
import { Lava3DSetData } from '../../../../lib/lava3d/types';

type Lava3DPageProps = {
  setData: {
    _id: string;
    grid_data: [];
    grid_width: number;
    grid_height: number;
    set_name: string;
  };
};

export default function Lava3DPage({ setData }: Lava3DPageProps) {
  const gameData: Lava3DSetData = {
    id: setData._id,
    gridData: setData.grid_data as { color: string; opacity?: number }[][],
    gridWidth: Number(setData.grid_width),
    gridHeight: Number(setData.grid_height),
    setName: setData.set_name || '',
  };

  return (
    <Layout>
      <Lava3DGame setData={gameData} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const setData = await getSetData(params?.id as string);

  return {
    props: {
      setData,
    },
  };
};
