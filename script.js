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
  const getSymbol = () => symbol;

  return {
    getSymbol,
  };
}

function gameFactory(player1, player2, boardObj) {
  let currentPlayer = player2; // TODO: randomly select who starts
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
    }
    return false;
  };

  const makeMove = (i) => {
    boardObj.cells[i] = currentPlayer.getSymbol();
    console.log(`
    ${boardObj.cells[0]} | ${boardObj.cells[1]} | ${boardObj.cells[2]}
    ----------- 
    ${boardObj.cells[3]} | ${boardObj.cells[4]} | ${boardObj.cells[5]}
    ----------- 
    ${boardObj.cells[6]} | ${boardObj.cells[7]} | ${boardObj.cells[8]}
   `); // TEST
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  const play = (i) => {
    if (!currentPlayer.getSymbol()) {
      gameMessages.selectSymbol();
      return;
    }

    if (isValidMove(i)) {
      makeMove(i);

      if (isWinner()) {
        gameMessages.win(currentPlayer.getSymbol());
        return;
      }

      if (boardObj.isFull()) {
        gameMessages.tie();
        return;
      }

      switchPlayer()
      return;
    }

    gameMessages.selectAnotherCell();
    return;
  };

  return {
    play,
  };
}