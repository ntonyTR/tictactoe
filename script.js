const players = (function() {
  const X = playerFactory("X");
  const O = playerFactory("O");

  return {
    X,
    O
  }
})();

function playerFactory(symbol) {
  const getSymbol = () => symbol;

  return {
    getSymbol,
  };
}

const board = (function () {
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
  const clearBoard = () => {
    cells.forEach((_, i, arr) => {
      arr[i] = ""
    })
  };

  return {
    cells,
    winCombinations,
    isFull,
    clearBoard,
  };
})();

const game = (function (player1, player2, boardObj) {
  let currentPlayer = player1; // TODO: let the player select its symbol, the player will start  the first round
  let tiesScore = 0;

  const gameMessages = {
    win: (winner) => {
      console.log(`${winner} wins.`);
    },
    tie: (score) => {
      console.log(`Tie. Ties score: ${score}`);
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
  };

  const play = (i) => {
    if (!currentPlayer.getSymbol()) {
      gameMessages.selectSymbol();
      return;
    }

    if (isValidMove(i)) {
      makeMove(i);

      if (isWinner()) {
        gameMessages.win(currentPlayer.getSymbol());
        boardObj.clearBoard()
        return;
      }

      if (boardObj.isFull()) {
        tiesScore++;
        gameMessages.tie(tiesScore);
        boardObj.clearBoard()
        return;
      }

      switchPlayer();
      return;
    }

    gameMessages.selectAnotherCell();
    return;
  };

  return {
    play,
  };
})(players.X, players.O, board);