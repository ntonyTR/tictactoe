function boardFactory() {
  const cells = ["", "", "", "", "", "", "", "", ""];
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const isFull = () => {
    return cells.every((cell) => cell !== "");
  };

  return {
    cells,
    winCombinations,
    isFull,
  };
}

function playerFactory(symbol) {
  const switchPlayer = () => {
    symbol = symbol === "X" ? "O" : "X";
  };
  const getSymbol = () => symbol;

  return {
    getSymbol,
    switchPlayer,
  };
}

function gameFactory(playerObj, boardObj) {
  currentPlayer = playerObj.getSymbol();
  const gameMessages = {
    win: (winner) => {
      console.log(`${winner} wins.`);
    },
    tie: () => {
      console.log("Tie.");
    },
    selectSymbol: () => {
      console.log("Select a symbol.");
    },
    selectAnotherCell: () => {
      console.log("Select another cell.");
    },
  };

  const play = (i) => {
    if (!currentPlayer) {
      gameMessages.selectSymbol();
      return;
    }

    if (isValidMove(i)) {
      makeMove(i);

      if (isWinner()) {
        gameMessages.win(currentPlayer);
        return;
      }

      if (boardObj.isFull()) {
        gameMessages.tie();
        return;
      }

      playerObj.switchPlayer();
      currentPlayer = playerObj.getSymbol();
      return;
    }

    gameMessages.selectAnotherCell();
    return;
  };

  const makeMove = (i) => {
    boardObj.cells[i] = currentPlayer;
    console.log(`
    ${boardObj.cells[0]} | ${boardObj.cells[1]} | ${boardObj.cells[2]}
    ----------- 
    ${boardObj.cells[3]} | ${boardObj.cells[4]} | ${boardObj.cells[5]}
    ----------- 
    ${boardObj.cells[6]} | ${boardObj.cells[7]} | ${boardObj.cells[8]}
   `); // TEST
  };

  const isValidMove = (i) => {
    return boardObj.cells[i] === "";
  };

  const isWinner = () => {
    for (const combination of boardObj.winCombinations) {
      const [a, b, c] = combination;
      if (
        boardObj.cells[a] &&
        boardObj.cells[a] === boardObj.cells[b] &&
        boardObj.cells[a] === boardObj.cells[c]
      ) {
        return true;
      }
      return false;
    }
  };

  return {
    play,
  };
}
