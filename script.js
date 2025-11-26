// Function for placing mark on the board
function placeMark(symbol, index) {
  const mark = document.createElement("img");

  mark.src = `./assets/${symbol}-removedBg.png`;
  mark.classList.add("mark");

  const cells = document.querySelectorAll(".row-col");
  cells[index].appendChild(mark);

  // Add a delay to ensure transition runs correctly
  requestAnimationFrame(() => {
    mark.classList.add("active");
  });
}

function handleInput(game, nextMove) {
  const cells = document.querySelectorAll(".row-col");

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (game.endGame === true) return;
      if (game.board[index] === "") {
        game.board[index] = game.player;

        placeMark(game.player, index);

        if (nextMove) {
          nextMove();
        }
      }
    });
  });
}

function botMove(board) {
  //find empty cells
  const emptyCell = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") emptyCell.push(i);
  }

  if (emptyCell.length === 0) return;

  // pick random empty cell
  const move = emptyCell[Math.floor(Math.random() * emptyCell.length)];

  board[move] = "O";
  placeMark("O", move);
  console.log(move);
}

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

function printPlayerCard(game, gameMode) {
  const cards = document.querySelectorAll(".player-card");
  cards.forEach((card, index) => {
    const player = card.querySelector(".player-name");
    const score = card.querySelector(".player-score");
    if (gameMode === "player") {
      if (index === 0) player.textContent = "Player 1";
      else player.textContent = "Player 2";
    } else {
      if (index === 0) player.textContent = "Player 1";
      else player.textContent = "Bot";
    }

    if (index === 0) score.textContent = `Score: ${game.score1}`;
    else score.textContent = `Score: ${game.score2}`;
  });
}

function printResult(winner) {
  const notif = document.querySelector(".game-notif");
  notif.textContent = winner;
}

// Game Mode Function (vs. Player & vs. Bot)
function playerMode(game) {
  handleInput(game, () => {
    if (checkWinner(game.board, winningCondition) === "X") {
      game.endGame = true;
      game.score1++;
      localStorage.setItem("score1", game.score1);
      printPlayerCard(game, "player");
      printResult("Player 1 Wins!");
      return;
    } else if (checkWinner(game.board, winningCondition) === "O") {
      game.endGame = true;
      game.score2++;
      localStorage.setItem("score2", game.score2);
      printPlayerCard(game, "player");
      printResult("Player 2 Wins!");
    }

    if (checkDraw(game.board)) {
      game.end = true;
      printResult("It's a Draw!");
    }

    if (game.player === "X") game.player = "O";
    else game.player = "X";
  });
}

function botMode(game) {
  handleInput(game, () => {
    if (checkDraw(game.board)) {
      game.end = true;
      printResult("It's a Draw!");
    }
    if (checkWinner(game.board, winningCondition) === "X") {
      game.endGame = true;
      game.score1++;
      localStorage.setItem("score1", game.score1);

      printPlayerCard(game, "bot");
      printResult("Player Wins!");
      return;
    }
    botMove(game.board);
    if (checkWinner(game.board, winningCondition) === "O") {
      game.endGame = true;
      game.score2++;
      localStorage.setItem("score2", game.score2);

      printPlayerCard(game, "bot");
      printResult("Bot Wins!");
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
    score1: parseInt(localStorage.getItem("score1") || 0),
    score2: parseInt(localStorage.getItem("score2") || 0),
  };
  if (gameMode === "player") {
    playerMode(game);
  } else {
    botMode(game);
  }

  printPlayerCard(game, gameMode);
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

const backButton = document.getElementById("back-btn");
const restartButton = document.getElementById("restart-btn");

backButton.addEventListener("click", () => {
  localStorage.removeItem("score1");
  localStorage.removeItem("score2");
});

restartButton.addEventListener("click", () => {
  location.reload();
});
