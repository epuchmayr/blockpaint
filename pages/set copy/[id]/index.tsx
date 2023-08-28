import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { getAllSetIds, getSetData ,getSetsData } from "../../../lib/set";

import styles from './index.module.scss'

import {
  ChangeEvent,
  FocusEvent,
  BaseSyntheticEvent,
  useEffect,
  useState,
  createContext,
  Suspense,
} from "react";
import { TOOLS, PREFS, GRID, APPSTATE } from "../../../CONSTANTS";

import Grid from "../../../components/Grid";
import Toolbar from "../../../components/Toolbar";
import Palettes from "../../../components/Palettes";
import SetLoader from "../../../components/SetLoader";
import Layout from "../../../components/Layout";

// SET constants
const DEFAULTCOLOR = GRID.DEFAULT_COLOR;
const DEFAULTBLOCK = GRID.DEFAULT_BLOCK;
const GRIDWIDTH = GRID.DEFAULT_WIDTH;
const GRIDHEIGHT = GRID.DEFAULT_HEIGHT;

// CREATE default block set
const gridRow = Array.from(Array(GRIDWIDTH), () => {
  return DEFAULTBLOCK;
});

const gridArray = Array.from(Array(GRIDHEIGHT), () => {
  // use Array.from to make each row unique
  return Array.from(gridRow);
});

const defaultSessionPrefs = {
  currentColor: DEFAULTCOLOR,
  currentTool: TOOLS.DRAW,
  currentSetId: "",
  colorHistory: [DEFAULTCOLOR],
};
interface SingleDataContext {
  gridData: [];
  gridWidth: Number;
  gridHeight: Number;
  setName: String;
}

// SET context to share state with children
export const SessionPrefsContext = createContext(defaultSessionPrefs);
export const AllSetsDataContext = createContext([]);
export const SetDataContext = createContext<SingleDataContext>({
  gridData: [],
  gridWidth: GRIDWIDTH,
  gridHeight: GRIDHEIGHT,
  setName: "",
});

export default function Set({
  setData,
  setsData
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
  setsData: []
}) {
  let [sessionPrefs, setSessionPrefs] = useState({...defaultSessionPrefs, currentSetId: setData._id});

  // parse and stringify to deep copy array
  let [newSetData, setNewSetData] = useState({
    gridData: JSON.parse(JSON.stringify(setData.grid_data)),
    gridWidth: setData.grid_width,
    gridHeight: setData.grid_height,
    setName: setData.set_name || "",
    createdDate: setData.created_date,
    lastUpdate: setData.last_update,
    creator: setData.creator,
    isLocked: setData.isLocked,
    id: setData._id
  });

  let [isHeldActive, setIsHeldActive] = useState(false);

  interface position {
    row: number;
    col: number;
  }

  function fillSingleBlock(position: position, newColor: string) {
    setNewSetData((prevData) => {
      prevData.gridData[position.row][position.col] = {
        color: newColor,
        opacity: 1,
      };
      return { ...prevData };
    });
  }

  function handleMouseDown(event: MouseEvent, position: position) {
    if (sessionPrefs.currentTool === TOOLS.DRAW) {
      fillSingleBlock(position, sessionPrefs.currentColor);
    } else if (sessionPrefs.currentTool === TOOLS.ERASE) {
      fillSingleBlock(position, "#ffffff");
    } else if (sessionPrefs.currentTool === TOOLS.EYEDROP) {
      setSessionPrefs((prevPrefs) => {
        return {
          ...prevPrefs,
          currentColor: newSetData.gridData[position.row][position.col].color,
        };
      });
    }
  }

  function handleMouseEnter(event: MouseEvent, position: position) {
    if (isHeldActive) {
      handleMouseDown(event, position);
    }
  }

  function updateSetData(event: BaseSyntheticEvent) {
    const { name, value }: { name: string; value: string } = event.target;
    setNewSetData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handlePickerChange(event: ChangeEvent<HTMLInputElement>) {
    setSessionPrefs((prevPrefs) => {
      return { ...prevPrefs, currentColor: event.target.value };
    });
  }

  function handleChangeColor(event: BaseSyntheticEvent) {
    const targetColor = event.target.value;
    setSessionPrefs((prevPrefs) => {
      return { ...prevPrefs, currentColor: targetColor };
    });

    addColorToHistory(targetColor);
  }

  function addColorToHistory(newColor: string) {
    if (sessionPrefs.colorHistory[0] !== newColor) {
      setSessionPrefs((prevPrefs) => {
        if (prevPrefs.colorHistory.length >= PREFS.SWATCH_HISTORY_SIZE) {
          prevPrefs.colorHistory.pop();
        }
        prevPrefs.colorHistory.unshift(newColor);
        return prevPrefs;
      });
    }
  }

  function handleClickTool(event: BaseSyntheticEvent) {
    setSessionPrefs((prevPrefs) => {
      return { ...prevPrefs, currentTool: event.target.value };
    });
  }

  // UPDATE canvas
  useEffect(() => {
    // if (viewState !== APPSTATE.CREATOR) return;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas && canvas?.getContext("2d");

    newSetData.gridData.map((row: { color: string }[], index: number) => {
      for (const block in row) {
        let numBlock = parseInt(block);
        let currentBlock = row[numBlock];
        let sizeX = canvas.width / row.length;
        let sizeY = canvas.height / newSetData.gridData.length;
        let blockX = numBlock * sizeX;
        let blockY = index * sizeY;
        ctx!.fillStyle = currentBlock.color;
        ctx!.fillRect(blockX, blockY, blockX + sizeX, blockY + sizeY);
      }
    });
  }, [newSetData]);

  function handlePickerBlur(event: FocusEvent<HTMLInputElement>) {
    addColorToHistory(event.target.value);
  }

  // DOWNLOAD image from canvas
  let [downloadImage, setDownloadImage] = useState(false);

  function handleDownload() {
    setDownloadImage(true);
  }

  function makeEncodedImage() {
    const canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    const encodedImage = canvas!.toDataURL();
    return encodedImage;
  }

  useEffect(() => {
    // https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/
    if (!downloadImage) return;
    const encodedImage = makeEncodedImage();

    var element = document.createElement("a");
    element.setAttribute("href", encodedImage);
    element.setAttribute("download", "file");

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadImage(false);
  }, [downloadImage]);

  // SAVE image to database
  async function handleSave(setId: string) {
    if (setId !== "") {
      const response = await fetch(`../api/blockSet/update/${setId}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grid_data: newSetData.gridData,
          thumbnail: makeEncodedImage(),
          set_name: newSetData.setName,
          last_update: new Date(),
        }),
      });
      // await handleLoadSets()

    } else {
      const response = await fetch(`../api/blockSet/createSet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grid_data: newSetData.gridData,
          grid_width: newSetData.gridWidth,
          grid_height: newSetData.gridHeight,
          thumbnail: makeEncodedImage(),
          set_name: "",
          created_date: new Date(),
          last_update: new Date(),
          creator: "",
          isLocked: false,
        }),
      });
      const jsonData = await response.json();
      // await handleLoadSets()
      setSessionPrefs((prevPrefs) => {
        return { ...prevPrefs, currentSetId: jsonData.insertedId };
      });
    }
  }

  // LOAD image from database
  async function handleLoad(setId: string) {
    // const response = await fetch(`../api/blockSet/${setId}`);
    // const jsonData = await response.json();
    console.log('new load', setData)
    
    setNewSetData((prevData) => ({
      ...prevData,
      gridData: JSON.parse(JSON.stringify(setData.grid_data)),
      gridWidth: setData.grid_width,
      gridHeight: setData.grid_height,
      setName: setData.set_name || "",
      createdDate: setData.created_date,
      lastUpdate: setData.last_update,
      creator: setData.creator,
      isLocked: setData.isLocked,
      id: setData._id
    }));
    setSessionPrefs((prevPrefs) => {
      return { ...prevPrefs, currentSetId: setData._id };
    });
    
  }

  // DELETE image from database
  // async function handleDelete(setId: string) {
  //   if (window.confirm("Are you sure you want to permanently delete this set?")) {
  //     await fetch(`../api/blockSet/delete/${setId}`);
  //     //const jsonData = await response.json();
  //     handleLoadNew()
  //     handleLoadSets()
  //   }
  // }

  // LOAD sets from database
  // async function handleLoadSets() {
  //   const response = await fetch(`../api/blockSet/getSets`);
  //   const jsonData = await response.json();
  //   const parsedData = JSON.parse(JSON.stringify(jsonData))
  //   setSetsData(parsedData)
  // }

  function handleLoadNew() {
    setNewSetData((prevData) => ({
      ...prevData,
      gridData: JSON.parse(JSON.stringify(gridArray)),
      setName: "",
    }));
    setSessionPrefs((prevPrefs) => ({
      ...prevPrefs,
      currentSetId: "",
    }));
  }

  useEffect(() => {
    // handleLoadSets()
    if (sessionPrefs.currentSetId !== '') {
      handleLoad(sessionPrefs.currentSetId)
    }
  }, [setData])

  return (
    <>
      <Layout>

        <SessionPrefsContext.Provider value={sessionPrefs}>
          <AllSetsDataContext.Provider value={setsData}>
            <SetLoader handleLoadNew={handleLoadNew} />
          </AllSetsDataContext.Provider>
        </SessionPrefsContext.Provider>


        <div className={styles.main}
          onMouseDown={() => setIsHeldActive(true)}
          onMouseUp={() => setIsHeldActive(false)}
          onMouseEnter={() => setIsHeldActive(false)}>

          <SessionPrefsContext.Provider value={sessionPrefs}>
            <Toolbar handleClickTool={handleClickTool} />
          </SessionPrefsContext.Provider>

          <div className={styles.artboard}>
            <Suspense fallback={<p>Loading set...</p>}>
              <Grid
                gridData={newSetData.gridData}
                handleMouseDown={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
              />
            </Suspense>
          </div>

          <aside className={styles.optionsMenu}>
            ID: {newSetData.id}
            <br />
            Set name: {newSetData.setName || "[unnamed]"}
            <br />
            Created: {new Date(newSetData.createdDate).toUTCString()}
            <br />
            Updated: {new Date(newSetData.lastUpdate).toUTCString()}
            <br />
            Dimensions: {newSetData.gridWidth} x {newSetData.gridHeight}
            <br />
            Creator: {newSetData.creator || "[unknown]"}
            <br />
            isLocked: {newSetData.isLocked.toString()}
            <br />
            <Link
                href={`/game/${setData._id}`} as={`/game/${setData._id}`}>
                Play {setData.set_name || '[unnamed]'}
            </Link><br />
            {(JSON.stringify(setData.grid_data) === JSON.stringify(newSetData.gridData)) ? '' : '(save changes to update play)'}
            <br />
            <p>{`${setData.grid_width} x ${setData.grid_height}`}</p>

            <canvas id="canvas" width="150" height="150">
              canvas
            </canvas>
            <br />
            {sessionPrefs.currentSetId !== "" ? (
              <>
                <input
                  name="setName"
                  value={newSetData.setName}
                  placeholder={sessionPrefs.currentSetId}
                  onChange={(e) => updateSetData(e)}
                />
                <br />
                <button onClick={() => handleLoad(sessionPrefs.currentSetId)}>
                  Reload set
                </button>
                {` `}
                {/* <button onClick={() => handleDelete(sessionPrefs.currentSetId)}>DELETE set</button> */}
                <br />
                <button onClick={handleDownload}>Download as PNG</button>
                <br />
                <br />
              </>
            ) : null}
            <button onClick={() => handleSave(sessionPrefs.currentSetId)}>
              {sessionPrefs.currentSetId !== ""
                ? `Save changes`
                : `Save as a new`}
            </button>
            <br />
            <br />
            <input
              className="foregroundColour"
              name="color"
              type="color"
              value={sessionPrefs.currentColor.toString()}
              onChange={handlePickerChange}
              onBlur={handlePickerBlur}
            />
            <Palettes handleChangeColor={handleChangeColor} />


          </aside>
        </div>
      </Layout>
    </>
  );
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
  const setsData = await getSetsData();
  return {
    props: {
      setData,
      setsData,
    },
  };
};
