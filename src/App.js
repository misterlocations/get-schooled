import { useState, useEffect } from 'react';
import { shuffle, take } from 'lodash';

import { getLegalMoveSpots, calculateColorScore } from './util';

// https://www.svgrepo.com/

import Tile from './components/Tile';
import BankTile from './components/BankTile';
import { COLORS, ANIMALS } from './constants';

function generateInitialBoard() {

  const board = [];
  for (let y = 0; y < 6; y++) {
    const row = [];
    for (let x = 0; x < 6; x++) {
      row.push({
        x,
        y,
      })
    }
    board.push(row);
  }

  return board;
}

function generateTileSet() {
  const tileSet = {};
  let counter = 1;

  COLORS.forEach(color => {
    ANIMALS.forEach(animal => {
      tileSet[counter] = {
        animal,
        color,
        id: counter
      };
      counter++;
    })
  })
  return tileSet;
}

function App() {

  const [board, setBoard] = useState(generateInitialBoard());
  const [targetTile, setTargetTile] = useState(null);
  const [isMoving, setIsMoving] = useState(false);

  // the entire set of tiles. 36 of them.
  // generate by fitting every animal/color combo, and setting a unique id
  const [tileSet, setTileSet] = useState(generateTileSet());
  const [bank, setBank] = useState(shuffle(Object.values(tileSet)));
  const [availableBank, setAvailableBank] = useState([]);
  const [legalMoveSpots, setLegalMoveSpots] = useState([]);

  useEffect(() => {
    setAvailableBank(take(bank, 6))
    console.log(
      calculateColorScore(tileSet, board)
    );
    if(bank.length === 0){
      console.log(
        calculateColorScore(tileSet, board)
      );
    }
  }, [bank])

  function handlePlaceTile(x, y) {

    // addressed column-first
    const spotToPlace = board[y][x];
    const isSpotOccupied = spotToPlace['occupyingTile'];
    const isLegalMove = legalMoveSpots.some(spot => spot.x === x && spot.y === y)

    // before we do any deletion or adding, make sure we have a tile to place, and it's
    // going in a legal spot

    // if we ARE moving, make sure it's being done legally
    const isDoingLegalMove = !isMoving || isLegalMove;

    // new tile placement
    if (targetTile && !isSpotOccupied && isDoingLegalMove) {
      const newBoard = board;

      // delete any duplicates of tiles, i.e. in a tile move
      const alreadyPlacedTargetTile = newBoard.flat().find(item => item.occupyingTile === targetTile);
      if (alreadyPlacedTargetTile) {
        alreadyPlacedTargetTile.occupyingTile = null;
      }

      // addressed column-first
      newBoard[y][x]['occupyingTile'] = targetTile;

      setTargetTile(null);
      setBoard(newBoard);
      setBank(bank.filter(item => item.id !== targetTile))
      setIsMoving(false);
      setLegalMoveSpots([])
    }
  }

  function handleSelectTile(id) {

    setIsMoving(false);
    setLegalMoveSpots([]);

    // cancel tile selection if target re-selected
    if (targetTile === id) {
      setTargetTile(null);
      setIsMoving(false);
      setLegalMoveSpots([]);
    } else {

      // only calculate legalMoves if we're doing a MOVE on the board
      const boardTargetTile = board.flat().find(item => item.occupyingTile === id);
      if (boardTargetTile) {
        setIsMoving(true)
        setLegalMoveSpots(getLegalMoveSpots(board, boardTargetTile))
      }
      setTargetTile(id);
    }

  }

  return (
    <div className="h-screen bg-indigo-100 w-full flex justify-center items-center flex-col">
      <div className="w-full md:w-3/5 lg:w-2/5 border-8 border-blue-300 rounded-md bg-blue-300 grid grid-cols-6 grid-rows-6 cursor-pointer gap-1">
        {
          board.flat().map(boardTile => {
            const isLegalMoveTile = legalMoveSpots.find(spot => spot.x === boardTile.x && spot.y === boardTile.y)
            return <div className={`group ${isLegalMoveTile ? 'bg-blue-400' : 'bg-blue-200'} hover:bg-red-400 hover:text-white aspect-square`} onClick={() => handlePlaceTile(boardTile.x, boardTile.y)}>{
              boardTile.occupyingTile &&
              (
                <div className={boardTile.occupyingTile !== targetTile ? "" : "opacity-25"}>
                  {boardTile.occupyingTile}
                  <Tile animal={tileSet[boardTile.occupyingTile].animal} color={tileSet[boardTile.occupyingTile].color} onSelect={() => handleSelectTile(boardTile.occupyingTile)} />
                </div>
              )
            }</div>
          })
        }
      </div>

      <div className="mt-12 flex flex-row justify-evenly items-center w-full px-10">
        {availableBank.length > 0 && <div className="w-full md:w-3/5 lg:w-2/5 border-8 border-blue-300 rounded-md bg-blue-300 grid grid-cols-6 grid-rows-1 cursor-pointer gap-1">
          {
            availableBank.map((abItem) => (
              <div className={targetTile ? abItem.id !== targetTile ? "" : "opacity-25" : ""}>
                <BankTile animal={abItem.animal} color={abItem.color} onSelect={() => handleSelectTile(abItem.id)} />
              </div>
            ))
          }
        </div>}
      </div>

    </div>
  );
}

export default App;
