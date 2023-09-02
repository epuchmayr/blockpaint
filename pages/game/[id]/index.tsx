import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSetData } from '../../../lib/set';

import { createContext } from 'react';
import { SetDataContext } from '../../../pages';

import { TOOLS } from '../../../CONSTANTS';
import Layout from '../../../components/Layout';
import Game from '../../../components/Game';

const defaultSessionPrefs = {
  currentColor: '#fff',
  currentTool: TOOLS.DRAW,
  currentSetId: '',
  colorHistory: ['#fff'],
};
export const SessionPrefsContext = createContext(defaultSessionPrefs);
export const AllSetsDataContext = createContext([]);
// export const SetDataContext = createContext<SingleDataContext>({
//   gridData: [],
//   gridWidth: 25,
//   gridHeight: 25,
//   setName: ''
// });

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
  let gameData = {
    id: setData._id,
    gridData: setData.grid_data,
    gridWidth: setData.grid_width,
    gridHeight: setData.grid_height,
    setName: setData.set_name,
  };

  return (
    <Layout>

      <SetDataContext.Provider value={gameData}>
        <Game />
      </SetDataContext.Provider>

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
