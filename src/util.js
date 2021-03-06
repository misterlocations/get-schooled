import { COLORS, ANIMALS } from "./constants";

export function generateTileSet() {
  const tileSet = {};
  let counter = 1;

  COLORS.forEach((color) => {
    ANIMALS.forEach((animal) => {
      tileSet[counter] = {
        animal,
        color,
        id: counter,
      };
      counter++;
    });
  });
  return tileSet;
}

const tileSet = generateTileSet();

export function generateInitialBoard() {
  const board = [];
  for (let y = 0; y < 6; y++) {
    const row = [];
    for (let x = 0; x < 6; x++) {
      row.push({
        x,
        y,
      });
    }
    board.push(row);
  }

  return board;
}

export function getLegalMoveSpaces(board, boardSpace) {
  const legalMoves = [];

  // are there spots above?
  if (boardSpace.y > 0) {
    for (let y = boardSpace.y - 1; y >= 0; y--) {
      if (board[y][boardSpace.x].occupyingTile) {
        break;
      } else {
        legalMoves.push({ x: boardSpace.x, y });
      }
    }
  }

  // // are there spots below?
  if (boardSpace.y < 5) {
    for (let y = boardSpace.y + 1; y < 6; y++) {
      if (board[y][boardSpace.x].occupyingTile) {
        break;
      } else {
        legalMoves.push({ x: boardSpace.x, y });
      }
    }
  }

  // // are there spots to the right?
  if (boardSpace.x < 5) {
    for (let x = boardSpace.x + 1; x < 6; x++) {
      if (board[boardSpace.y][x].occupyingTile) {
        break;
      } else {
        legalMoves.push({ x, y: boardSpace.y });
      }
    }
  }

  // are there spots to the left?
  if (boardSpace.x > 0) {
    for (let x = boardSpace.x - 1; x >= 0; x--) {
      if (board[boardSpace.y][x].occupyingTile) {
        break;
      } else {
        legalMoves.push({ x, y: boardSpace.y });
      }
    }
  }

  return legalMoves;
}

// @todo refactor so calculateScore only takes the board buffer. board should probably not exist in this context?
export function calculateScore(board, matchType) {
  const matchGroups = getMatchGroups(board, matchType);
  return matchGroups.reduce(
    (totalScore, matchGroup) =>
      totalScore + getScoreForMatches(matchGroup.length),
    0
  );
}

export function getMatchGroups(board, matchType) {
  const boardCopy = JSON.parse(JSON.stringify(board));
  const matchGroups = [];
  let boardBuffer = boardCopy
    .flat()
    .filter((boardItem) => boardItem.occupyingTile);

  while (boardBuffer.length > 0) {
    const tileToEval = tileSet[boardBuffer[0].occupyingTile];
    const matches = getMatches(boardBuffer, tileToEval, matchType);
    matchGroups.push(matches);
    // remove board item which contains ids of match group just discovered
    boardBuffer = boardBuffer.filter(
      (boardSpace) =>
        !matches.some((item) => item.id === boardSpace.occupyingTile)
    );
  }

  return matchGroups;
}

// given a space on the board, get adjacent existing spaces
export function getAdjacentSpaces(board, boardSpace) {
  const upCheck = board.find(
    (toCheck) => toCheck.x === boardSpace.x && toCheck.y === boardSpace.y - 1
  );
  const downCheck = board.find(
    (toCheck) => toCheck.x === boardSpace.x && toCheck.y === boardSpace.y + 1
  );
  const leftCheck = board.find(
    (toCheck) => toCheck.x === boardSpace.x - 1 && toCheck.y === boardSpace.y
  );
  const rightCheck = board.find(
    (toCheck) => toCheck.x === boardSpace.x + 1 && toCheck.y === boardSpace.y
  );

  return [upCheck, downCheck, leftCheck, rightCheck].filter((exists) => exists);
}

// given an existing tile on the board, get adjacent tiles
export function getAdjacentTiles(board, tile) {
  const spaceOnBoard = board.find(
    (toCheck) => toCheck.occupyingTile === tile.id
  );

  // should we throw an error in a better way?
  if (!spaceOnBoard) return [];

  const upCheck = board.find(
    (toCheck) =>
      toCheck.x === spaceOnBoard.x && toCheck.y === spaceOnBoard.y - 1
  );
  const downCheck = board.find(
    (toCheck) =>
      toCheck.x === spaceOnBoard.x && toCheck.y === spaceOnBoard.y + 1
  );
  const leftCheck = board.find(
    (toCheck) =>
      toCheck.x === spaceOnBoard.x - 1 && toCheck.y === spaceOnBoard.y
  );
  const rightCheck = board.find(
    (toCheck) =>
      toCheck.x === spaceOnBoard.x + 1 && toCheck.y === spaceOnBoard.y
  );

  // convert located board spaces to tiles
  return [upCheck, downCheck, leftCheck, rightCheck]
    .filter((boardSpace) => boardSpace && boardSpace.occupyingTile)
    .map((boardSpace) => ({
      x: boardSpace.x,
      y: boardSpace.y,
      id: boardSpace.occupyingTile,
    }));
}

export function getMatches(board, tile, matchType) {
  const compare = tileSet[tile.id][matchType];
  const matchPool = [tileSet[tile.id]];
  let checkPool = [tile.id];

  while (checkPool.length > 0) {
    const currentCheckId = checkPool[0];
    const checks = getAdjacentTiles(board, tileSet[currentCheckId]);

    checks.forEach((check) => {
      if (
        !matchPool.some((poolItem) => poolItem.id === check.id) &&
        tileSet[check.id][matchType] === compare
      ) {
        matchPool.push(tileSet[check.id]);
        checkPool.push(check.id);
      }
    });

    checkPool = checkPool.filter((entry) => entry !== currentCheckId);
  }

  return matchPool;
}

// called tileGroup because it may not necessarily be a matchGroup...
export function getSpacesAroundGroup(board, tileGroup) {
  // there will be duplicates of spaces found - consider biases vs using Set
  const spacesAroundGroup = [];
  tileGroup.forEach((tile) => {
    const spaceContainingTile = board.find(
      (toCheck) => toCheck.occupyingTile === tile.id
    );

    const adjacentSpaces = getAdjacentSpaces(board, spaceContainingTile);

    // look at all the tiles, add the ones that are empty, don't add ones that are not.
    adjacentSpaces.forEach((space) => {
      if (!space.occupyingTile) {
        spacesAroundGroup.push(space);
      }
    });
  });

  return spacesAroundGroup;
}

export function getScoreForMatches(numberOfMatches) {
  switch (numberOfMatches) {
    case 0:
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 3;
    case 4:
      return 6;
    case 5:
      return 10;
    case 6:
      return 15;
    default:
      return 0;
  }
}
