import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { ChangeEvent, MouseEventHandler, useEffect, useState } from 'react'


import { TOOLS, PREFS, GRID } from '../CONSTANTS'

import Grid from '../components/Grid'
import Toolbar from '../components/Toolbar'
import Palette from '../components/Palette'


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
let gridRow = Array.from(Array(GRIDWIDTH), () => {
  return DEFAULTBLOCK;
});

const gridArray = Array.from(Array(GRIDHEIGHT), () => {
  // use Array.from to make each row unique
  return Array.from(gridRow);
});



export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  let [sessionPrefs, setSessionPrefs] = useState({ 
    currentColor: DEFAULTCOLOR,
    currentTool: TOOLS.DRAW,
    colorHistory: [DEFAULTCOLOR]
  })

  let [gridData, setGridData] = useState(gridArray)
  let [isHeldActive, setIsHeldActive] = useState(false)
 

  interface position {
    row: number, col: number
  }


  function fillSingleBlock(position: position, newColor: string) {
    setGridData(prevData => {
      [...prevData][position.row][position.col] = {color: newColor, opacity: 1}
      return [...prevData]
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
        currentColor: gridData[position.row][position.col].color
        }
    })
    }
  }


  function handleMouseEnter(event: MouseEventHandler, position: position) {
    if (isHeldActive) {
      handleMouseDown(event, position)
    }
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
    console.log(sessionPrefs.colorHistory[0], newColor)
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


  useEffect(() => {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas && canvas?.getContext("2d");

    gridData.map((row, index) => {
      for (const block in row) {
        let numBlock = parseInt(block)
        let currentBlock = row[numBlock]
        let sizeX = canvas.width / row.length
        let sizeY = canvas.height / gridData.length
        let blockX = numBlock*sizeX
        let blockY = index*sizeY
        ctx!.fillStyle = currentBlock.color;
        ctx!.fillRect(blockX, blockY, blockX+sizeX, blockY+sizeY);
      }
    })

  }, [gridData])


  function handlePickerChange(event: ChangeEvent<HTMLInputElement>) {
    setSessionPrefs(prevPrefs => {
      return {...prevPrefs,
      currentColor: event.target?.value
      }
    })
  }


  function handlePickerBlur(event: ChangeEvent<HTMLInputElement>) {
    addColorToHistory(event.target?.value)
  }

  // DOWNLOAD image from canvas
  let [downloadImage, setDownloadImage] = useState(false)

  function handleDownload() {
    setDownloadImage(true)
  }

  useEffect(() => {
    // https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/
    if (!downloadImage) return
    const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
    const encodedImage = canvas!.toDataURL();
    console.log('image base/64', encodedImage)
 
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
    
    const response = await fetch(`../api/blockSet/update/${setId}`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridData)
    });
    const jsonData = await response.json();
    console.log(jsonData);
  }

  
  // LOAD image from database
  async function handleLoad(setId: string) {
    
    const response = await fetch(`../api/blockSet/${setId}`);
    const jsonData = await response.json();
    console.log(jsonData.blockData);
    setGridData(jsonData.blockData)
  }

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



      
      <main>

        <aside className='tool-menu'>
          <Toolbar handleClickTool={handleClickTool} currentTool={sessionPrefs.currentTool} />

          <label>
            <input
            className='foregroundColour'
            name='color'
            type='color'
            value={sessionPrefs.currentColor.toString()}
            onChange={handlePickerChange}
            onBlur={handlePickerBlur}
            />
          </label>
        </aside>
        
        <div className='artboard'>
          <Grid gridData={gridData} handleMouseDown={handleMouseDown} handleMouseEnter={handleMouseEnter} />
        </div>

        <aside className='options-menu'>
          <p>
          {`${GRIDWIDTH} x ${GRIDHEIGHT}`}
          </p>
          <canvas id='canvas' width="150" height="150">canvas</canvas>
          <br />
          <button onClick={() => handleLoad('64372cb6f8a0a2ee097b08bc')}>Load Image</button>
          <br />
          <button onClick={() => handleSave('64372cb6f8a0a2ee097b08bc')}>Save Image</button>
          <br />
          <button onClick={handleDownload}>Download Image</button>
          <br />

          <Palette
            title={'Basic Colours'}
            swatches={['#ffffff', '#000000', '#ff0000', '#ffff00', '#00ffff', '#00ff00', '#0000ff', '#ff00ff']}
            clickHandler={handleChangeColor}
          />
          <Palette
            title={'Colour History'}
            swatches={sessionPrefs.colorHistory}
            clickHandler={handleChangeColor}
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
        
        .foregroundColour {
          padding: 0;
        }
        .foregroundColour::-webkit-color-swatch-wrapper {
          padding: 0; 
        }
        .foregroundColour::-webkit-color-swatch {
          border: none;
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
        .tool-menu {
          border-right: 1px solid #aaa;
        }
        .artboard {
          align-self: center;
        }
        .options-menu {
          border-left: 1px solid #aaa;
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
