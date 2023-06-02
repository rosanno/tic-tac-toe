var board = ["", "", "", "", "", "", "", "", ""];
var currentPlayer = "X";
var player1;
var player2;
var player1Score = 0;
var player2Score = 0;
var botScore = 0;
var totalRounds;
const playerMode = document.querySelectorAll(".player-mode");
const raceMode = document.querySelectorAll(".race-mode");
const playerOneName = document.querySelector(".player-one");
const playerTwoName = document.querySelector(".player-two");
const playerTurnLabel = document.getElementById("player-turn-label");
let gameMode = "";
let selectedRound;

const hideShow = (selector, prop1, prop2) => {
  document.querySelector(selector).classList.replace(prop1, prop2);
};

const setName = (selector, playerName) => {
  document.getElementById(selector).innerText = playerName;
};

const startGame = (event) => {
  event.preventDefault();
  playerTurnLabel.innerText = getPlayerName(currentPlayer);

  if (gameMode === "1") {
    setName("p1", playerOneName.value);
    setName("p2", "bot");
  } else {
    setName("p1", playerOneName.value);
    setName("p2", playerTwoName.value);
  }

  if (gameMode !== "" && selectedRound !== "") {
    totalRounds = parseInt(selectedRound);
    hideShow("#table", "d-none", "d-flex");
    hideShow(".form-container", "d-flex", "d-none");
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    // document.getElementById("status").innerText = "";
    renderBoard();
  }
};

const getPlayerName = (playerSymbol) => {
  if (gameMode === "1") {
    return playerSymbol === "X" ? playerOneName.value : "bot";
  } else {
    return playerSymbol === "X" ? playerOneName.value : playerTwoName.value;
  }
};

const makeMove = (index) => {
  if (board[index] === "") {
    board[index] = currentPlayer;
    renderBoard();

    if (checkWin()) {
      Swal.fire(`${getPlayerName(currentPlayer)} wins this round!`);
      updateScore();
      if (player1Score === totalRounds || player2Score === totalRounds) {
        Swal.fire({
          title: `${getWinner()} wins the game`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Play again",
          buttonsStyling: false,
          customClass: {
            confirmButton: "custom-button-class",
          },
          preConfirm: () => {
            window.location.reload();
          },
        });
      } else {
        setTimeout(startRound, 1000);
      }
    } else if (board.indexOf("") === -1) {
      Swal.fire("It's a tie!");
      setTimeout(startRound, 1000);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      playerTurnLabel.innerText = getPlayerName(currentPlayer); // Update the player turn label
      if (gameMode === "1" && currentPlayer === "O") {
        setTimeout(makeBotMove, 300);
      }
    }
  }
};

const startRound = () => {
  currentPlayer = "X";
  board = ["", "", "", "", "", "", "", "", ""];
  // document.getElementById("status").innerText = "";
  renderBoard();
};

function renderBoard() {
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = board[i];
  }
}

const checkWin = () => {
  var winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (var i = 0; i < winningCombos.length; i++) {
    var [a, b, c] = winningCombos[i];
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
};

const makeBotMove = () => {
  playerTurnLabel.innerText = getPlayerName(currentPlayer);

  var emptyCells = board.reduce(function (acc, cell, index) {
    if (cell === "") {
      acc.push(index);
    }
    return acc;
  }, []);

  var randomIndex = Math.floor(Math.random() * emptyCells.length);
  makeMove(emptyCells[randomIndex]);
};

const updateScore = () => {
  if (gameMode === "2") {
    if (currentPlayer === "X") {
      player1Score++;
      document.getElementById("p1-score").innerHTML = player1Score;
    } else {
      player2Score++;
      document.getElementById("p2-score").innerHTML = player2Score;
    }
  } else {
    if (currentPlayer === "X") {
      player1Score++;
      document.getElementById("p1-score").innerHTML = player1Score;
    } else {
      botScore++;
      document.getElementById("p2-score").innerHTML = botScore;
    }
  }
};

const getWinner = () => {
  if (player1Score === totalRounds) {
    return playerOneName.value;
  } else if (player2Score === totalRounds) {
    return playerTwoName.value;
  }
};

const playerModeSelect = (event) => {
  gameMode = event.target.value;

  gameMode !== "" &&
    (hideShow("#playerOption", "d-flex", "d-none"), hideShow("#raceOption", "d-none", "d-flex"));
};

const roundSelect = (event) => {
  selectedRound = event.target.value;

  if (gameMode === "2") {
    hideShow(".mode-container", "d-flex", "d-none");
    hideShow(".form-container", "d-none", "d-flex");
  } else {
    hideShow(".mode-container", "d-flex", "d-none");
    hideShow(".form-container", "d-none", "d-flex");
    document.querySelector(".input-two-container").classList.add("d-none");
  }
};

playerMode.forEach((input) => {
  input.addEventListener("click", playerModeSelect);
});

raceMode.forEach((input) => {
  input.addEventListener("click", roundSelect);
});

document.querySelector("#playBtn").addEventListener("click", startGame);
