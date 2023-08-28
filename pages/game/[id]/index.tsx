import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { getAllSetIds, getSetData } from "../../../lib/set";

import { createContext } from "react";
import { SetDataContext } from '../../../pages'

import { TOOLS, PREFS, GRID, APPSTATE } from "../../../CONSTANTS";
import Layout from "../../../components/Layout";
import Game from "../../../components/Game";

const defaultSessionPrefs = { 
  currentColor: '#fff',
  currentTool: TOOLS.DRAW,
  currentSetId: '',
  colorHistory: ['#fff']
}
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
    grid_width: string;
    grid_height: string;
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
    setName: setData.set_name
  }

  return (
    <Layout>
      <Head>
        <title>Blockpaint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
        <>
          <SetDataContext.Provider value={gameData}>
            <Game handleBack={() => handleSetMode(APPSTATE.CREATOR)}  />
          </SetDataContext.Provider>
        </>

      <footer>
      </footer>
  </Layout>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  let paths = await getAllSetIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const setData = await getSetData(params?.id as string);
  return {
    props: {
      setData,
    },
  };
};
