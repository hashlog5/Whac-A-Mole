const timerCounter = document.getElementById('timer-counter');
const scoreCounter = document.getElementById('score-counter');
const renderGameBtn = document.getElementById('render-game-btn');

const numberOfHoles = 6;
const gameGrid = document.querySelector('#game-grid');
function createGameGrid() {
  for (let i = 0; i < numberOfHoles; i++) {
    gameGrid.innerHTML += `<div class="hole">
				<div class="mound"></div>
				<div class="mole"></div>
			</div>`;
  }
}
createGameGrid();

const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');

const gameDuration = 30000;
const popupMinDuration = 450;
const popupMaxDuration = 750;

let gameOver = true;
let gameInitiated = false;

let gameDurationId;
let popUpDurationId;
let popUpAgainId;
let whackAMoleId;
let timeLeftId;

let timeLeft;
let score;
let lastHoleIdx;

renderGameBtn.addEventListener('click', renderGame);
moles.forEach((mole) => mole.addEventListener('click', whackAMole));

function renderGame() {
  if (!gameInitiated) {
    newGame();
  } else {
    endGame();
  }
}

function newGame() {
  gameOver = false;
  gameInitiated = true;

  timeLeft = gameDuration / 1000;
  score = 0;
  timeLeftId = setInterval(timerCountdown, 1000);
  timerCounter.textContent = timeLeft;
  scoreCounter.textContent = score;

  renderGameBtn.style.backgroundColor = 'tomato';
  renderGameBtn.textContent = 'End Game';
  popUpMole();

  gameDurationId = setTimeout(() => {
    timerCountdown();
    endGame();
  }, gameDuration);
}

function endGame() {
  gameOver = true;
  gameInitiated = false;

  clearTimeout(gameDurationId);
  clearTimeout(popUpDurationId);
  clearTimeout(popUpAgainId);
  clearTimeout(whackAMoleId);
  clearInterval(timeLeftId);

  renderGameBtn.style.backgroundColor = 'lightgreen';
  renderGameBtn.textContent = 'New Game';
  holes[lastHoleIdx].classList.remove('popup');
}

function popUpMole() {
  const popupDuration = randomPopupDuration(popupMinDuration, popupMaxDuration);
  const newHole = randomHole();

  newHole.classList.remove('whacked');
  newHole.classList.add('popup');

  popUpDurationId = setTimeout(() => {
    newHole.classList.add('whacked');
    newHole.classList.remove('popup');

    popUpAgain();
  }, popupDuration);
}

function whackAMole() {
  if (!this.parentNode.classList.contains('whacked')) {
    clearInterval(popUpDurationId);

    score++;
    scoreCounter.textContent = score;
    this.parentNode.classList.add('whacked');
    this.classList.add('shake');

    whackAMoleId = setTimeout(() => {
      this.classList.remove('shake');
      this.parentNode.classList.remove('popup');

      popUpAgain();
    }, 250);
  }
}

function popUpAgain() {
  if (!gameOver) {
    popUpAgainId = setTimeout(() => {
      popUpMole();
    }, 250);
  }
}

function timerCountdown() {
  timeLeft--;
  if (timeLeft >= 0) {
    timerCounter.textContent = `${timeLeft}s`;
  }
}

function randomPopupDuration(popupMinDuration, popupMaxDuration) {
  return Math.floor(
    Math.random() * (popupMaxDuration - popupMinDuration) + popupMinDuration
  );
}

function randomHole() {
  const newHoleIdx = Math.floor(Math.random() * holes.length);

  if (newHoleIdx === lastHoleIdx) {
    return randomHole();
  } else {
    lastHoleIdx = newHoleIdx;
    return holes[newHoleIdx];
  }
}
