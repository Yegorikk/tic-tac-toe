let startButton = document.querySelector('#startingWindow > button');
startButton.addEventListener('click', initGame);
restartG.addEventListener('click', restartGame);
newG.addEventListener('click', newGame);
let config
let movesCount = 0;
let isSecondPlayer = false;
let gameBoard;

function getConfig() {
  try {
    let config = JSON.parse(json.value);
    config.moves = []
    return config;
  } catch (error) {
    console.error;
    alert('Please, provide valid JSON')
    throw error;
  }
}

function initGame() {
  config = getConfig();
  if (validateConfig(config)) {
    startGame();
  }
}

function validateConfig(config) {

  const { players, boardDimensions, winningSequenceLength } = config
  // check names
  if (!(players instanceof Array) || players.length !== 2) {
    alert('The players field or names fields are missing');
    return false;
  }

  if (!players[0].name || !players[1].name) {
    alert('Please provide names for both players.');
    return false;
  }

  if (!boardDimensions || boardDimensions.length !== 2) {
    alert('Please provide valid board dimensions.');
    return false;
  }

  const [rows, cols] = boardDimensions;

  if (typeof rows !== 'number' || typeof cols !== 'number' || rows <= 0 || cols <= 0) {
    alert('Please provide valid board dimensions.');
    return false;
  }

  if (rows > 7 || cols > 20) {
    alert('Board dimensions cannot exceed [7, 20].');
    return false;
  }

  if (typeof winningSequenceLength !== 'number' || winningSequenceLength <= 0) {
    alert('Please provide a valid winning sequence length.');
    return false;
  }

  if (winningSequenceLength > rows || winningSequenceLength > cols) {
    alert('Winning sequence length cannot exceed board dimensions.');
    return false;
  }

  return true;
}

function startGame() {
  startingWindow.style.display = "none"
  endingWindow.style.display = "none"
  board.style.display = "flex"
  versusField.innerHTML = config.players[0].name + " VS " + config.players[1].name
  playerTurn.innerHTML = config.players[+isSecondPlayer].name + " turn";
  createField()
}

function createField() {
  const [rows, cols] = config.boardDimensions;
  field.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  field.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      createCell(i, j);
    }
  }
  resetGameBoard()
}

function resetGameBoard() {
  gameBoard = [];
  const [rows, cols] = config.boardDimensions;
  for (let i = 0; i < rows; i++) {
    gameBoard.push(Array(cols).fill(null));
  }
}

function createCell(row, column) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cell.dataset.row = row;
  cell.dataset.column = column;
  cell.addEventListener('click', handleTurn);
  cell.innerHTML = "&nbsp;&nbsp;";
  field.appendChild(cell);
}

function handleTurn(event) {
  const clickedCell = event.target;
  const { row, column } = clickedCell.dataset;

  if (!gameBoard[row][column]) {
    const currentPlayer = config.players[+isSecondPlayer];
    clickedCell.innerHTML = currentPlayer.mark;
    playerTurn.innerHTML = config.players[+!isSecondPlayer].name + " turn";
    gameBoard[row][column] = currentPlayer.mark;
    checkResult(currentPlayer, gameBoard);
    isSecondPlayer = !isSecondPlayer
  }
}

function checkResult(player, gameBoard) {
  movesCount++;
  const [rows, cols] = config.boardDimensions;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j <= cols - config.winningSequenceLength; j++) {
      let winCount = 0;
      for (let k = 0; k < config.winningSequenceLength; k++) {
        if (gameBoard[i][j + k] === player.mark) {
          winCount++;
        } else {
          break;
        }
      }
      if (winCount === config.winningSequenceLength) {
        endGame(player);
      }
    }
  }

  for (let i = 0; i <= rows - config.winningSequenceLength; i++) {
    for (let j = 0; j < cols; j++) {
      let winCount = 0;
      for (let k = 0; k < config.winningSequenceLength; k++) {
        if (gameBoard[i + k][j] === player.mark) {
          winCount++;
        } else {
          break;
        }
      }
      if (winCount === config.winningSequenceLength) {
        endGame(player);
      }
    }
  }

  for (let i = 0; i <= rows - config.winningSequenceLength; i++) {
    for (let j = 0; j <= cols - config.winningSequenceLength; j++) {
      let winCount = 0;
      for (let k = 0; k < config.winningSequenceLength; k++) {
        if (gameBoard[i + k][j + k] === player.mark) {
          winCount++;
        } else {
          break;
        }
      }
      if (winCount === config.winningSequenceLength) {
        endGame(player);
      }
    }
  }

  for (let i = 0; i <= rows - config.winningSequenceLength; i++) {
    for (let j = config.winningSequenceLength - 1; j < cols; j++) {
      let winCount = 0;
      for (let k = 0; k < config.winningSequenceLength; k++) {
        if (gameBoard[i + k][j - k] === player.mark) {
          winCount++;
        } else {
          break;
        }
      }
      if (winCount === config.winningSequenceLength) {
        endGame(player);
      }
    }
  }

  if (movesCount === config.boardDimensions[0] * config.boardDimensions[1]) {
    endGame();
  }
}

function endGame(player) {
  console.log('endGame')
  board.style.display = "none"
  endingWindow.style.display = "flex"
  if (player) {
    result.innerHTML = `${player.name} wins!`
  } else {
    result.innerHTML = `It's a draw!`
  }
}

function restartGame() {
  reset()
  endingWindow.style.display = "none"
  board.style.display = "flex"
  playerTurn.innerHTML = config.players[+isSecondPlayer].name + " turn";
}

function newGame() {
  reset()
  field.innerHTML = '';
  endingWindow.style.display = "none"
  startingWindow.style.display = "flex"
}

function reset() {
  let cells = document.querySelectorAll("#field > div");
  cells.forEach(cell => {
    cell.innerHTML = "&nbsp;&nbsp;";
  })
  resetGameBoard()
  movesCount = 0
  isSecondPlayer = 0;
  config = null;
  config = getConfig();
}