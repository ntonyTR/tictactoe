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
  const cells = Array(9).fill("");
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
    return cells.every(Boolean);
  };

  const clearBoard = () => {
    cells.forEach((_, i, arr) => {
      arr[i] = "";
    });
  };

  const getBoard = () => board;

  return {
    cells,
    getBoard,
    winCombinations,
    isFull,
    clearBoard,
  };
})();

const gameFactory = function (playerObj, boardObj) {
  const { player1, player2 } = playerObj;
  let currentPlayer = player1;
  let tiesScore = document.getElementById("ties-score"); // this should be in ui

  const gameMessages = {
    win: (winner) => `Player ${winner} wins.`,
    turn: (currentPlayer) => `${currentPlayer}'s turn`,
    tie: `Tie.`,
    selectAnotherCell: `Select another cell.`,
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

  let isGameOver = false;
  const makeMove = (i) => {
    if (isGameOver) {
      board.clearBoard();
      isGameOver = false;
    }
    boardObj.cells[i] = currentPlayer.getSymbol();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  let currentMessage = gameMessages.turn(currentPlayer.getSymbol())

  const play = (i) => {
    if (!currentPlayer.getSymbol()) {
      return;
    }

    currentMessage = gameMessages.turn(currentPlayer.getSymbol());

    if (isValidMove(i)) {
      makeMove(i);

      if (isWinner()) {
        isGameOver = true;
        currentPlayer.incrementScore();
        currentMessage = gameMessages.win(currentPlayer.getSymbol());
        switchPlayer();
        return currentMessage;
      }

      if (boardObj.isFull()) {
        tiesScore.textContent++; // tiesScore should be in ui
        currentMessage = gameMessages.tie;
        boardObj.clearBoard();
        switchPlayer();
        return currentMessage;
      }

      switchPlayer();
      return currentMessage;
    }

    currentMessage = gameMessages.selectAnotherCell;
    return currentMessage;
  };

  const getCurrentMessage = () => currentMessage;

  return {
    play,
    gameMessages,
    currentPlayer,
    getCurrentMessage,
  };
};

const ui = (function () {
  const players = {};
  const currentGame = null;
  
  const startModal = {
    symbolSelectorModal: document.getElementById("player-selector-modal"),
    symbolSelectorBtns: document.getElementById("symbol-buttons-container"),

    assignPlayers: function (symbol, playersObj) {
      playersObj.player1 = playerFactory(symbol);
      playersObj.player2 = playerFactory(symbol === "X" ? "O" : "X");
    },

    symbolButtonClickHandler: (e) => {
      if (e.target && e.target.tagName === "BUTTON") {
        startModal.assignPlayers(e.target.textContent, ui.players);
        startModal.symbolSelectorModal.classList.toggle("hide");
        ui.currentGame = gameFactory(ui.players, board);
        gameStatus.changeMessage(ui.currentGame.getCurrentMessage())
      }
    },
  };
  
  const gameStatus = {
    gameStatusMessage: document.getElementById("game-status-message"),
    changeMessage: function (message) {
      this.gameStatusMessage.textContent = message;
    },
  };
  
  const boardController = {
    boardContainer: document.getElementById("board-container"),
    boardCells: document.querySelectorAll(".cell"),
    
    handleMove: function (cellIndex) {
      ui.currentGame.play(cellIndex);
    },
    
    renderBoard: function () {
      const boardCellsArr = board.cells;
      this.boardCells.forEach(function (cell, index) {
        cell.textContent = boardCellsArr[index];
      });
    },

    boardClickHanlder: (e) => {
      if(e.target && e.target.tagName === "BUTTON"){
        gameStatus.changeMessage(ui.currentGame.getCurrentMessage());
        let cellIndex = e.target.getAttribute("data-index");
        boardController.handleMove(cellIndex);
        boardController.renderBoard()
      }
    }
  };
  
  startModal.symbolSelectorBtns.addEventListener("click", startModal.symbolButtonClickHandler);
  boardController.boardContainer.addEventListener("click", boardController.boardClickHanlder);

  return {
    startModal,
    players,
    currentGame,
    gameStatus,
    boardController,
  };
})();