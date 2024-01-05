const boardContainer = document.getElementById("board-container");

boardContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    console.log(e.target.textContent);
    let index = e.target.textContent;
    ui.startModal.play(index);
  }
});

const ui = (function () {
const startModal = {
    playerSelectorModal: document.getElementById("player-selector-modal"),
    playerSelectorBtns: document.getElementById("symbol-buttons-container"),

    players: {
      p1: {},
      p2: {},
    },

    currentGame: null,

    assignPlayers: function (element, playersObject) {
      let selectedSymbol = element.textContent;
      playersObject.p1 = playerFactory(selectedSymbol);
      playersObject.p2 = playerFactory(selectedSymbol === "X" ? "O" : "X");
    },

    startNewGame: function (players) {
      return game(players.p1, players.p2, board);
    },

    symbolButtonClickHandler: (e) => {
      if (e.target && e.target.tagName === "BUTTON") {
        startModal.assignPlayers(e.target, startModal.players);
        startModal.playerSelectorModal.classList.toggle("hide");
        startModal.currentGame = startModal.startNewGame(startModal.players);
      }
    },

    play: function (i) {
      this.currentGame.play(i);
    },
  };

  startModal.playerSelectorBtns.addEventListener("click", startModal.symbolButtonClickHandler);

  return {
    startModal,
  };
})();

function playerFactory(symbol) {
  const getSymbol = () => symbol;

  let score = 0;
  const getScore = () => score;
  function incrementScore() {
    ++score;
  }

  return {
    getSymbol,
    getScore,
    incrementScore,
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
      arr[i] = "";
    });
  };

  return {
    cells,
    winCombinations,
    isFull,
    clearBoard,
  };
})();

const game = function (player1, player2, boardObj) {
  // es un constructor
  let currentPlayer = player1;
  let tiesScore = 0;

  const gameMessages = {
    win: (winner) => {
      console.log(`${winner} wins.`);
    },
    tie: () => {
      console.log(`Tie.`);
    },
    selectSymbol: () => {
      console.log("Select a symbol.");
    },
    selectAnotherCell: () => {
      console.log("Select another cell.");
    },
    printScores: () => {
      console.log(`
      Player ${player1.getSymbol()} score: ${player1.getScore()}
      Player ${player2.getSymbol()} score: ${player2.getScore()}
      Ties: ${tiesScore}
      `);
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
        currentPlayer.incrementScore();
        gameMessages.win(currentPlayer.getSymbol());
        gameMessages.printScores();
        boardObj.clearBoard();
        switchPlayer();
        return;
      }

      if (boardObj.isFull()) {
        tiesScore++;
        gameMessages.tie();
        gameMessages.printScores();
        boardObj.clearBoard();
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
};
