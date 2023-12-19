const board = ["", "", "", "", "", "", "", "", ""];
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

let player = "x";

function checkWinner() {
  for (const combination of winCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function move(index) {
  if (board[index] === "") {
    board[index] = player;

    if (checkWinner()) {
      console.log("Ganaste");
    } else {
      player = player === "x" ? "o" : "x";
    }
  } else {
    console.log("Casilla Ocupada");
  }

  console.log(`${board[0]} ${board[1]} ${board[2]}\n${board[3]} ${board[4]} ${board[5]}\n${board[6]} ${board[7]} ${board[8]}
  `);
}
