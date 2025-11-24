// Player Input (Player Move)
function handleInput(game, nextMove) {
  const cells = document.querySelectorAll(".row-col");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (game.endGame === true) return;
      if (game.board[index] === "") {
        game.board[index] = game.player;
        cell.innerHTML += `<img src="./assets/${game.player}-removedBg.png" alt="cross-icon" class="mark">`;

        if (nextMove) {
          nextMove();
        }
      }
    });
  });
}

// Bot Move
function botMove(board) {
  const emptyCell = [];

  // Check empty square
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") emptyCell.push(i);
  }

  if (emptyCell.length === 0) return;
  // Random for bot to move
  let move = Math.floor(Math.random() * emptyCell.length);
  board[emptyCell[move]] = "O";
  const cells = document.querySelectorAll(".row-col");
  cells[
    emptyCell[move]
  ].innerHTML += `<img src="./assets/O-removedBg.png" alt="cross-icon" class="mark">`;
}

// Winnning Condition
const winningCondition = [
  // Check Vertical Cell (Col)
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // Check Horizontal square (Row)
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // Check Diagonal square
  [0, 4, 8],
  [2, 4, 6],
];

// Check Board is there any winner ?
function checkWinner(board, winningCondition) {
  for (let i = 0; i < winningCondition.length; i++) {
    let firstCol = board[winningCondition[i][0]];

    if (firstCol === "") continue;

    let check = true;

    for (let j = 0; j < winningCondition[i].length; j++) {
      if (board[winningCondition[i][j]] !== firstCol) {
        check = false;
        break;
      }
    }

    if (check === true) return firstCol;
  }
  return "";
}

// Check Board Draw ?
function checkDraw(board) {
  let check = true;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") check = false;
  }
  return check;
}

// Vs Player
function playerMode(game) {
  handleInput(game, () => {
    if (checkWinner(game.board, winningCondition) === "X") {
      game.endGame = true;
      console.log("Player 1 Wins");
      return;
    } else if (checkWinner(game.board, winningCondition) === "O") {
      game.endGame = true;
      console.log("Player 2 Wins");
    }

    if (checkDraw(game.board)) {
      game.end = true;
      console.log("Draw");
    }

    if (game.player === "X") game.player = "O";
    else game.player = "X";
  });
}

// Vs Bot
function botMode(game) {
  // Ada 2 possibility nanti tambagin coin flip buat nentuin urutannya siapa duluan
  handleInput(game, () => {
    if (checkDraw(game.board)) {
      game.end = true;
      console.log("Draw");
    }
    if (checkWinner(game.board, winningCondition) === "X") {
      game.endGame = true;
      console.log("Player Wins");
      return;
    }
    botMove(game.board);
    if (checkWinner(game.board, winningCondition) === "O") {
      game.endGame = true;
      console.log("Bot Wins");
      return;
    }
  });
}

// Main Function
function gameFunction(gameMode) {
  const game = {
    board: new Array(9).fill(""),
    endGame: false,
    player: "X",
  };

  if (gameMode === "player") {
    playerMode(game);
  } else {
    botMode(game);
  }
}

// Getting the mode choosen by player (vs. bot or vs. player)
const url = window.location.search;
const mode = url.split("=")[1];

const title = document.getElementById("mode-title");
if (mode === "bot") {
  title.textContent = "Player Vs. Bot";
  gameFunction("bot");
} else {
  title.textContent = "Player Vs. Player";
  gameFunction("player");
}
