const game = {
  currentPlayer: "",
  board: ["", "", "", "", "", "", "", "", ""],
  winCombinations: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  gameMessages: {
    win: (winner) => {
      console.log(`${winner} wins.`); //TEST
    },
    tie: () => {
      console.log("Tie"); //TEST
    },
    selectSymbol: () => {
      console.log("Select a symbol."); //TEST
    },
    selectAnotherCell: () => {
      console.log("Select another cell."); //TEST
    },
  },
  play: function (i) {
    if (!this.currentPlayer) {
      this.gameMessages.selectSymbol();
      return
    }

    if (this.isValidMove(i)) {
      this.makeMove(i);

      if (this.isWinner()) {
        this.gameMessages.win(this.currentPlayer);
        return;
      }

      if (this.isBoardFull()) {
        this.gameMessages.tie();
        return;
      }

      this.switchPlayer();
      return;
    }
    this.gameMessages.selectAnotherCell();
  },
  makeMove: function (i) {
    this.board[i] = this.currentPlayer;
    console.log(`
    ${this.board[0]} | ${this.board[1]} | ${this.board[2]}
    ----------- 
    ${this.board[3]} | ${this.board[4]} | ${this.board[5]}
    ----------- 
    ${this.board[6]} | ${this.board[7]} | ${this.board[8]}
   `); // TEST
  },
  isValidMove: function (i) {
    return this.board[i] === "";
  },
  switchPlayer: function () {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  },
  isWinner: function () {
    for (const combination of this.winCombinations) {
      const [a, b, c] = combination;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return true;
      }
    }
    return false;
  },
  isBoardFull: function () {
    return this.board.every((cell) => cell !== "");
  },
};
