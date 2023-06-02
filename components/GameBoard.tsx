import { useContext, ReactElement, useCallback, useState, useEffect, useRef, MouseEventHandler } from 'react'
import * as PIXI from 'pixi.js'
import { Stage, Graphics, Sprite, Text } from '@pixi/react'

import { SetDataContext } from '../pages'

// import styles from './GameBoard.module.scss'

export default function Game({handleBack}: {handleBack: MouseEventHandler}) {

    // const playerPieceReact = useRef(null)

    // const setData = useContext(SetDataContext);

    // const [collision, setCollision] = useState(false)
    // const [endGame, setEndGame] = useState(false)
    
    // const [playerPosition, setPlayerPosition] = useState({x: 0,y: 0})

    // const canvasWidth = Math.min(window.innerWidth, 400)
    // const canvasHeight = Math.min(window.innerWidth, 400)

    // const blockData = {
    //     width: canvasWidth / [setData.gridData][0].length,
    //     height: canvasHeight / setData.gridData.length
    // }

    // interface attributes {
    //     x:number, y:number, width: number, height: number
    // }

    // /////////////////////////////

    // let goal: ReactElement[] = []
    // let pieces: ReactElement[] = []
    // let level: ReactElement[] = []
    // let background: ReactElement[] = []
    
    // function renderBoard() {

    //     setData.gridData.map((row: {color: string}[], index: number) => {
    //         for (const block in row) {
    //             let numBlock = parseInt(block)
    //             let currentBlock = row[numBlock]
    //             let sizeX = blockData.width
    //             let sizeY = blockData.height
    //             let blockX = numBlock*sizeX
    //             let blockY = index*sizeY
    //             let currentElement: ReactElement

    //             if(currentBlock.color === '#0000ff') {
    //                 currentElement = <DragabbleRectangle
    //                     x={blockX + 1}
    //                     y={blockY + 1}
    //                     width={sizeX +10}
    //                     height={sizeY +10}
    //                     color={currentBlock.color}
    //                     ref={playerPieceReact}
    //                     interactive={true}
    //                     pointermove={handleDragMove}
    //                 />
    //             } else {
    //                 currentElement = <Rectangle
    //                     x={blockX}
    //                     y={blockY}
    //                     width={sizeX}
    //                     height={sizeY}
    //                     color={currentBlock.color}
    //                 />
    //             }
                
    //             switch (currentBlock.color) {
    //                 case '#0000ff':
    //                     pieces.push(currentElement)
    //                     break;
    //                 case '#ff0000':
    //                     goal.push(currentElement)
    //                     break;
    //                 case '#000000':
    //                     level.push(currentElement)
    //                     break;
    //                 default:
    //                     background.push(currentElement)
    //                 }
    //         }
    //     })
    //     return [...background, ...level, ...goal, ...pieces]
    // }


    // function haveIntersection(r1: attributes, r2: attributes) {
    //     return !(
    //         r2.x > r1.x + r1.width ||
    //         r2.x + r2.width < r1.x ||
    //         r2.y > r1.y + r1.height ||
    //         r2.y + r2.height < r1.y
    //     );
    // }


    // function checkCollision(targetAttributes: {x: number, y: number, width: number, height: number}) {

    //     level.forEach(element => {
    //         if(haveIntersection(targetAttributes, element.props))
    //         setCollision(true)
    //     })
    //     goal.forEach(element => {
    //         if(haveIntersection(targetAttributes, element.props))
    //         setEndGame(true)
    //     })
    // }

    
    // function handleDragMove(e: any) {
    //     console.log('drag move')
    //     if(collision || endGame) {
    //         e.target.x(-20);
    //         e.target.y(0);
    //         return 
    //     }
    //     checkCollision(e.target.attrs)
    //     e.target.x(minMaxCanvasSize(e.target.x(), 'horizontal'));
    //     e.target.y(minMaxCanvasSize(e.target.y(), 'vertical'));
    // }

    // function minMaxCanvasSize(targetPosition: number, direction: string) {
    //     return (direction === 'horizontal') ?
    //     Math.min(Math.max(targetPosition, 0 + 1), canvasWidth-blockData.width + 1) :
    //     Math.min(Math.max(targetPosition, 0 + 1), canvasHeight-blockData.height + 1)
    // }
        
    
    // useEffect(() => {
        
    //     if (collision || endGame) {
    //         playerPieceReact.current?.to({
    //             x: -20,
    //             y: 0,
    //             duration: 0
    //         })
    //         return
    //     }
    //     let isMoving: Boolean = false

    //     function keycodeReact(event: KeyboardEvent) {

    //         console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`, isMoving, playerPieceReact)
    //         if (isMoving) return
    //         isMoving = true
    //         switch (event.key) {
    //             case 'ArrowUp':
    //             case 'w':
    //                     playerPieceReact.current?.to({
    //                         y: minMaxCanvasSize((playerPieceReact.current.attrs.y - blockData.height), 'vertical'),
    //                         onFinish: () => {isMoving = false;
    //                             checkCollision(playerPieceReact.current?.attrs)},
    //                         duration: .05
    //                     })
    //                 break;
    //             case 'ArrowLeft':
    //             case 'a':
    //                     playerPieceReact.current?.to({
    //                         x: minMaxCanvasSize(playerPieceReact.current.attrs.x - blockData.height, 'horizontal'),
    //                         onFinish: () => {isMoving = false;
    //                             checkCollision(playerPieceReact.current?.attrs)},
    //                         duration: .05
    //                     })
    //                 break;
    //             case 'ArrowDown':
    //             case 's':
    //                     playerPieceReact.current?.to({
    //                         y: minMaxCanvasSize(playerPieceReact.current.attrs.y + blockData.height, 'vertical'),
    //                         onFinish: () => {isMoving = false;
    //                             checkCollision(playerPieceReact.current?.attrs)},
    //                         duration: .05
    //                     })
    //                 break;
    //             case 'ArrowRight':
    //             case 'd':
    //                     playerPieceReact.current?.to({
    //                         x: minMaxCanvasSize(playerPieceReact.current.attrs.x + blockData.height, 'horizontal'),
    //                         onFinish: () => {isMoving = false;
    //                             checkCollision(playerPieceReact.current?.attrs)},
    //                         duration: .05
    //                     })
    //                 break;
    //             default:
    //                 break;
    //         }
    //         event.preventDefault()
    //     }

    //     window.addEventListener(
    //         "keydown",
    //         keycodeReact,
    //         true
    //     )
    //     return () => {
    //         window.removeEventListener(
    //             "keydown",
    //             keycodeReact,
    //             true
    //         )
    //     }
    // }, [collision, endGame])


    // useEffect(() => {
    //     setPlayerPosition({x: playerPieceReact.current?.attrs.x, y: playerPieceReact.current?.attrs.y})
    // }, [])


    // function resetGame() {
    //     setCollision(false)
    //     setEndGame(false)
    //     console.log(playerPosition)
    //     playerPieceReact.current?.to({
    //         x: playerPosition.x,
    //         y: playerPosition.y,
    //         duration: 0
    //     })
    // }


    // function Rectangle(props) {
    //     const draw = useCallback(
    //       (g) => {
    //         g.clear();
    //         g.beginFill(props.color);
    //         g.drawRect(props.x, props.y, props.width, props.height);
    //         g.endFill();
    //       },
    //       [props],
    //     );
      
    //     return <Graphics draw={draw} />;
    //   }


    // function DragabbleRectangle(props) {
    //     // const draw = useCallback(
    //     //   (g) => {
    //     //     g.clear();
    //     //     g.beginFill(props.color);
    //     //     g.drawRect(props.x, props.y, props.width, props.height);
    //     //     g.endFill();
    //     //   },
    //     //   [props],
    //     // );
    //     const isDragging = useRef(false);
    //     const offset = useRef({ x: 8, y: 8 });
    //     const [position, setPosition] = useState({ x: props.x || 0, y: props.y || 0 })
        
    //     function onStart(e) {
    //         isDragging.current = true;
    //         console.log('start move', e.data.global, isDragging.current)
    //       offset.current = {
    //         x: e.data.global.x - position.x,
    //         y: e.data.global.y - position.y
    //       };
          
    //     }
      
    //     function onEnd() {
    //         console.log('end move')
    //       isDragging.current = false;
    //     }
      
    //     function onMove(e) {
    //         console.log('move', isDragging.current)
    //     //   if (isDragging.current) {
    //         setPosition({
    //           x: e.data.global.x - offset.current.x,
    //           y: e.data.global.y - offset.current.y,
    //         })
    //     //   }
    //     }
      
    //     return <Sprite
    //     // draw={draw}
    //     position={position}
    //     texture={PIXI.Texture.WHITE}
    //     tint={0x0000ff}
    //     interactive={true}
    //     pointerdown={onStart}
    //     pointerup={onEnd}
    //     pointerupoutside={onEnd}
    //     pointermove={onMove}
    //    />;
    //   }

    // return (
    //     <>

    //     <div className={styles.game}>
    //         <div className={styles.board}>
                
    //         <Stage
    //         width={canvasWidth}
    //         height={canvasHeight}
    //         options={{ backgroundColor: 0xffffff }}
    //         onMouseDown={() => {console.log('mousedown')}}
    //         onPointerLeave={}
    //         >
    //             <Rectangle 
    //                 x={0}
    //                 y={0}
    //                 width={canvasWidth}
    //                 height={canvasHeight}
    //                 color={(endGame) ? 'green' : (!collision) ? 'white' : 'tomato'}
    //                 />
                
    //             {renderBoard()}
    //             <Text
    //             text={`Collision detected: ${collision}`}
    //             style={
    //                 new PIXI.TextStyle({
    //                     fontSize: 10,
    //                     stroke: '#01d27e',
    //                     dropShadow: true,
    //                     dropShadowColor: '#ccced2',
    //                     dropShadowBlur: 4,
    //                 })
    //             }
    //             />
                        
    //             <Text
    //                 text={(endGame) ? `YOU WIN!` : (collision) ? `HIT DETECTED` : ``}
    //                 style={
    //                     new PIXI.TextStyle({
    //                         align: 'center',
    //                         fontSize: 30,
    //                         stroke: '#ffffff',
    //                         strokeThickness: 5,
    //                     })
    //                 }
    //             />
    //         </Stage>
    //         </div>
    //         <div className={styles.actions}>
    //             <div>Game name: {(setData.setName) || `no name`}</div>
    //             <div>Objective: move blue to red<br/>without touching black</div>
    //             <button onClick={handleBack}>Return to Editor</button><br />
    //             <button onClick={resetGame}>reset game</button>
    //         </div>
    //     </div>
    //     </>
    // )
}