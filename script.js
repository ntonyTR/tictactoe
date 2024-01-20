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
      return;
    }
    boardObj.cells[i] = currentPlayer.getSymbol();
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const play = (i) => {
    if (isGameOver) return;
    if (isValidMove(i)) {
      makeMove(i);

      if (isWinner()) {
        isGameOver = true;
        currentPlayer.incrementScore();
        ui.gameStatus.changeMessage(
          ui.gameStatus.messages.win(currentPlayer.getSymbol())
        );
        switchPlayer();
        return;
      }

      if (boardObj.isFull()) {
        tiesScore.textContent++; // tiesScore should be in ui
        ui.gameStatus.changeMessage(ui.gameStatus.messages.tie);
        switchPlayer();
        return;
      }

      switchPlayer();
      ui.gameStatus.changeMessage(
        ui.gameStatus.messages.turn(currentPlayer.getSymbol())
      );
      return;
    }

    ui.gameStatus.changeMessage(ui.gameStatus.messages.selectAnotherCell);
    return;
  };

  return {
    play,
    currentPlayer,
    isGameOver,
  };
};

const ui = (function () {
  const players = {};
  let currentGame = null;

  const startModal = {
    symbolSelectorModal: document.getElementById("player-selector-modal"),
    symbolSelectorBtns: document.getElementById("symbol-buttons-container"),

    assignPlayers: function (symbol, playersObj) {
      playersObj.player1 = playerFactory(symbol);
      playersObj.player2 = playerFactory(symbol === "X" ? "O" : "X");
    },

    symbolButtonClickHandler: (e) => {
      if (e.target && e.target.tagName === "BUTTON") {
        startModal.assignPlayers(e.target.textContent, players);
        startModal.symbolSelectorModal.classList.toggle("hide");
        currentGame = gameFactory(players, board);
      }
    },
  };

  const gameStatus = {
    messageElement: document.getElementById("game-status-message"),

    messages: {
      win: (winner) => `Player ${winner} wins.`,
      turn: (currentPlayer) => `${currentPlayer} turn.`,
      tie: `Tie.`,
      selectAnotherCell: `Select another cell.`,
    },
    changeMessage: function (message) {
      this.messageElement.textContent = message;
    },
  };

  const boardController = {
    boardContainer: document.getElementById("board-container"),
    boardCells: document.querySelectorAll(".cell"),

    handleMove: function (cellIndex) {
      currentGame.play(cellIndex);
    },

    renderBoard: function () {
      const boardCellsArr = board.cells;
      this.boardCells.forEach(function (cell, index) {
        cell.textContent = boardCellsArr[index];
      });
    },

    boardClickHanlder: (e) => {
      if (e.target && e.target.tagName === "BUTTON") {
        let cellIndex = e.target.getAttribute("data-index");
        boardController.handleMove(cellIndex);
        boardController.renderBoard();
      }
    },
  };

  const reset = {
    button: document.getElementById("reset-button"),

    resetButtonClickHandler: () => {
      board.clearBoard();
      boardController.renderBoard();
    },
  };

  reset.button.addEventListener("click", reset.resetButtonClickHandler);
  startModal.symbolSelectorBtns.addEventListener("click", startModal.symbolButtonClickHandler);
  boardController.boardContainer.addEventListener("click", boardController.boardClickHanlder);

  return {
    gameStatus,
  };
})();
// TODO: HAZ QUE AL GANAR O EMPATAR, SE DESABILITE LA FUNCIONALIDAD PARA QUE TENGAN QUE DAR EN RESET, USA UN FLAG
// DESPUES DE HACER RESET, MUESTRA EL CURRENTPLAYER INICIAL
// BUG: AL RESETEAR DESPUES DE UN WIN, NO SE PINTA NADA
// YA HICE QUE LOS MENSAJES ESTEN EN UI, AHORA BUSCA UNA FORMA DE HACER LAS LLAMADAS A LOS MENSJAES MAS CORTAS
