import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { ChangeEvent, FocusEvent, MouseEventHandler, useEffect, useState, createContext } from 'react'


import { TOOLS, PREFS, GRID } from '../CONSTANTS'

import Grid from '../components/Grid'
import Toolbar from '../components/Toolbar'
import Palettes from '../components/Palettes'
import SetLoader from '../components/SetLoader'


export async function getServerSideProps() {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

// SET constants
const DEFAULTCOLOR = GRID.DEFAULT_COLOR
const DEFAULTBLOCK = GRID.DEFAULT_BLOCK
const GRIDWIDTH = GRID.DEFAULT_WIDTH
const GRIDHEIGHT = GRID.DEFAULT_HEIGHT

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
    currentSetId: '',
    colorHistory: [DEFAULTCOLOR]
  }

  // SET context to share state with children
export const SessionPrefsContext = createContext(defaultSessionPrefs);
export const SetsDataContext = createContext([]);

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  let [sessionPrefs, setSessionPrefs] = useState(defaultSessionPrefs)

  // parse and stringify to deep copy array
  let [setData, setSetData] = useState({
    gridData: JSON.parse(JSON.stringify(gridArray)),
    gridWidth: GRIDWIDTH,
    gridHeight: GRIDHEIGHT,
    setName: ''
  })
  let [isHeldActive, setIsHeldActive] = useState(false)
 
  let [viewState, setViewState] = useState('loader')

  let [setsData, setSetsData] = useState([])

  interface position {
    row: number, col: number
  }


  function fillSingleBlock(position: position, newColor: string) {
    setSetData((prevData) => {
      prevData.gridData[position.row][position.col] = {color: newColor, opacity: 1}
      return {...prevData}
    })
  }


  function handleMouseDown(event: any, position: position) {
    if (sessionPrefs.currentTool === TOOLS.DRAW) {
      fillSingleBlock(position, sessionPrefs.currentColor)
    } else if (sessionPrefs.currentTool === TOOLS.ERASE) {
      fillSingleBlock(position, '#ffffff')
    } else if (sessionPrefs.currentTool === TOOLS.EYEDROP) {
      setSessionPrefs(prevPrefs => {
        return {...prevPrefs,
        currentColor: setData.gridData[position.row][position.col].color
        }
      })
    }
  }


  function handleMouseEnter(event: MouseEventHandler, position: position) {
    if (isHeldActive) {
      handleMouseDown(event, position)
    }
  }

  function updateSetData(event: any) {
    const {name, value} : {name: string, value: string} = event.target
    setSetData(prevData => ({
      ...prevData,
      [name]: value
    })
    )
  }



  function handlePickerChange(event: ChangeEvent<HTMLInputElement>) {
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentColor: event.target?.value
      }
    })
  }

  function handleChangeColor(event: any) {
    const targetColor = event.target?.value
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentColor: targetColor
      }
    })

    addColorToHistory(targetColor)
  }


  function addColorToHistory(newColor: string) {
    if (sessionPrefs.colorHistory[0] !== newColor) {
    setSessionPrefs(prevPrefs => {
      if (prevPrefs.colorHistory.length >= PREFS.SWATCH_HISTORY_SIZE) {
        prevPrefs.colorHistory.pop()
      } 
      prevPrefs.colorHistory.unshift(newColor)
      return prevPrefs
    })
    }
  }


  function handleClickTool(event: any) {
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentTool: event.target?.value
      }
    })
  }

  // UPDATE canvas
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas && canvas?.getContext("2d");

    setData.gridData.map((row: {color: string}[], index: number) => {
      for (const block in row) {
        let numBlock = parseInt(block)
        let currentBlock = row[numBlock]
        let sizeX = canvas.width / row.length
        let sizeY = canvas.height / setData.gridData.length
        let blockX = numBlock*sizeX
        let blockY = index*sizeY
        ctx!.fillStyle = currentBlock.color;
        ctx!.fillRect(blockX, blockY, blockX+sizeX, blockY+sizeY);
      }
    })

  }, [setData])

  function handlePickerBlur(event: FocusEvent<HTMLInputElement>) {
    addColorToHistory(event.target?.value)
  }

  // DOWNLOAD image from canvas
  let [downloadImage, setDownloadImage] = useState(false)

  function handleDownload() {
    setDownloadImage(true)
  }

  function makeEncodedImage() {
    const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
    const encodedImage = canvas!.toDataURL();
    return encodedImage
  }

  useEffect(() => {
    // https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/
    if (!downloadImage) return
    const encodedImage = makeEncodedImage()
 
    var element = document.createElement('a');
    element.setAttribute('href', encodedImage);
    element.setAttribute('download', 'file');
 
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);


    setDownloadImage(false)
  }, [downloadImage])

  // SAVE image to database
  async function handleSave(setId: string) {
    if (setId !== '') {
      const response = await fetch(`../api/blockSet/update/${setId}`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grid_data: setData.gridData,
          thumbnail: makeEncodedImage(),
          set_name: setData.setName
        })
      })
      await handleLoadSets()
    } else {
      const response = await fetch(`../api/blockSet/createSet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grid_data: setData.gridData,
          grid_width: setData.gridWidth,
          grid_height: setData.gridHeight,
          thumbnail: makeEncodedImage(),
          set_name: '',
          created_date: new Date(),
          last_update: new Date(),
          creator: '',
          isLocked: false
        })
      });
      const jsonData = await response.json();
      await handleLoadSets()
      setSessionPrefs(prevPrefs => {
        return {...prevPrefs,
        currentSetId: jsonData.insertedId
        }
      })

    }
  }

  
  // LOAD image from database
  async function handleLoad(setId: string) {
    
    const response = await fetch(`../api/blockSet/${setId}`);
    const jsonData = await response.json();
    setSetData(prevData => ({
      ...prevData,
      gridData: jsonData.grid_data
    }))
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentSetId: setId
      }
    })
  }

  // DELETE image from database
  async function handleDelete(setId: string) {
    if (window.confirm("Are you sure you want to permanently delete this set?")) {
      await fetch(`../api/blockSet/delete/${setId}`);
      //const jsonData = await response.json();
      handleLoadNew()
      handleLoadSets()
    }
  }
  
  // LOAD sets from database
  async function handleLoadSets() {
    const response = await fetch(`../api/blockSet/getSets`);
    const jsonData = await response.json();
    const parsedData = JSON.parse(JSON.stringify(jsonData))
    setSetsData(parsedData)
  }

  function handleLoadNew() {
    setSetData(prevData => ({
      ...prevData,
      gridData: JSON.parse(JSON.stringify(gridArray))
    }))
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentSetId: ''
      }
    })
  }

  useEffect(() => {
    handleLoadSets()
    if (sessionPrefs.currentSetId !== '') {
      handleLoad(sessionPrefs.currentSetId)
    }
  }, [])

  return (
    <div
      className="container"
      onMouseDown={() => setIsHeldActive(true)}
      onMouseUp={() => setIsHeldActive(false)}
      onMouseEnter={() => setIsHeldActive(false)}
    >
      <Head>
        <title>Blockpaint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h3>Blockpaint <span>{isConnected ? `connected` : `NOT connected`}</span></h3>
      </header>


      {(viewState === 'loader') ? (
        <SessionPrefsContext.Provider value={sessionPrefs}>
          <SetsDataContext.Provider value={setsData}>
            <SetLoader handleLoadNew={handleLoadNew} handleLoad={handleLoad} />
          </SetsDataContext.Provider>
        </SessionPrefsContext.Provider>
      ) : (
        <h2 className="subtitle"></h2>
      )}
      
      <main>

        <SessionPrefsContext.Provider value={sessionPrefs}>
          <Toolbar
            handleClickTool={handleClickTool}
          />
        </SessionPrefsContext.Provider>
        
        <div className='artboard'>
          <Grid gridData={setData.gridData} handleMouseDown={handleMouseDown} handleMouseEnter={handleMouseEnter} />
        </div>

        <aside className='options-menu'>
          <p>
          {`${GRIDWIDTH} x ${GRIDHEIGHT}`}
          </p>
          <canvas id='canvas' width="150" height="150">canvas</canvas>
          <br />
          {(sessionPrefs.currentSetId !== '') ? (
            <>
              <input name='setName' value={setData.setName} placeholder={sessionPrefs.currentSetId} onChange={(e) => updateSetData(e)} />
              <br />
              <button onClick={() => handleLoad(sessionPrefs.currentSetId)}>Reload set</button>
              {` `}
              <button onClick={() => handleDelete(sessionPrefs.currentSetId)}>DELETE set</button>
              <br />
              <button onClick={handleDownload}>Download as PNG</button>
              <br />
              <br />
            </>
          ) : null}
          <button
            onClick={() => handleSave(sessionPrefs.currentSetId)}
          >
            {(sessionPrefs.currentSetId !== '') ? `Overwrite set` : `Save as a new set`}
          </button>
          <br />
          <br />

          

          <input
            className='foregroundColour'
            name='color'
            type='color'
            value={sessionPrefs.currentColor.toString()}
            onChange={handlePickerChange}
            onBlur={handlePickerBlur}
            />

          <Palettes
            handleChangeColor={handleChangeColor}
          />

        </aside>
      </main>

      <footer>
      </footer>

      <style jsx>{`
        header {
          border-bottom: 1px solid #aaa;
          padding-inline: 8px;
        }
        header h3 {
          margin: 0;
        }
        header h3 span {
          font-weight: 400;
          font-size: 1rem;
        }
        p {
          margin: 0 0 .5rem;
        }

        .container {
          background-color: #bbb;
        }

        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        main {
          display: flex;
          flex: 1;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
        }

        aside {
          padding: .5rem;
        }
        .artboard {
          align-self: center;
          flex: none;
        }
        .options-menu {
          border-left: 1px solid #aaa;
        }


        .foregroundColour {
          padding: 0;
      }
      .foregroundColour::-webkit-color-swatch-wrapper {
          padding: 0;
      }
      .foregroundColour::-webkit-color-swatch {
          border: none;
      }

        footer {
          width: 100%;
          height: 2rem;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
