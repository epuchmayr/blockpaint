import { GetServerSideProps } from 'next';
import { getSetData } from '../../../../lib/set';

import { useEffect } from 'react';

import Layout from '../../../../components/Layout';
import Game from '../../../../components/games/lava/Game';
import {
  CurrentSetData,
  useCurrentSetStore,
} from '../../../../lib/currentSetStore';

export default function Set({
  setData,
}: {
  setData: {
    _id: string;
    grid_data: [];
    grid_width: Number;
    grid_height: Number;
    thumbnail: string;
    created_date: string;
    last_update: string;
    creator: string;
    isLocked: boolean;
    set_name: string;
  };
}) {
  const setCurrentSetData = useCurrentSetStore(
    (state) => state.setCurrentSetData,
  );

  const gameData: CurrentSetData = {
    id: setData._id,
    gridData: setData.grid_data as { color: string; opacity?: number }[][],
    gridWidth: Number(setData.grid_width),
    gridHeight: Number(setData.grid_height),
    setName: setData.set_name || '',
  };

  useEffect(() => {
    setCurrentSetData(gameData);
  }, [gameData.id, setCurrentSetData]);

  return (
    <Layout>
      <Game />
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
