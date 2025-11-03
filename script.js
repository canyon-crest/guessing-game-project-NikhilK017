const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUpBtn") || document.getElementById("giveUp");
const msg = document.getElementById("msg");
const guessInput = document.getElementById("guess");
const winsEl = document.getElementById("wins");
const avgScoreEl = document.getElementById("avgScore");
const fastestEl = document.getElementById("fastest");
const avgTimeEl = document.getElementById("avgTime");
const dateEl = document.getElementById("date");

const levelRadios = Array.from(document.getElementsByName("level"));
const leaderboardEls = Array.from(document.getElementsByName("leaderboard"));

let level = Number(document.querySelector('input[name="level"]:checked')?.value) || 3;
let answer = 0;
let guessesThisRound = 0;
let totalWins = 0;
let totalGuesses = 0;
let totalGames = 0;
let totalTimeMs = 0;
let fastestMs = null;
let startMs = 0;
let gameActive = false;

const scores = [];

function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function time() {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const day = now.getDate();
  const suffix = getDaySuffix(day);
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${month} ${day}${suffix}, ${year}, ${hours}:${minutes}:${seconds} ${period}`;
}

function updateClock() {
  if (dateEl) {
    dateEl.textContent = time();
  }
}

updateClock();
setInterval(updateClock, 1000);

playBtn?.addEventListener("click", play);
guessBtn?.addEventListener("click", makeGuess);
giveUpBtn?.addEventListener("click", giveUp);

guessInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    makeGuess();
  }
});

renderScoreDisplay();

function play() {
  const selectedLevel = document.querySelector('input[name="level"]:checked');
  if (!selectedLevel) {
    return;
  }

  level = Number(selectedLevel.value);
  if (!Number.isFinite(level) || level < 1) {
    return;
  }

  guessesThisRound = 0;
  answer = Math.floor(Math.random() * level) + 1;
  startMs = Date.now();
  gameActive = true;

  msg.textContent = `Guess a number from 1-${level}`;
  guessInput.disabled = false;
  guessInput.value = "";
  guessInput.placeholder = `Enter a number 1-${level}`;
  guessInput.focus();

  playBtn.disabled = true;
  guessBtn.disabled = false;
  if (giveUpBtn) {
    giveUpBtn.disabled = false;
  }

  levelRadios.forEach((radio) => {
    radio.disabled = true;
  });
}

function makeGuess() {
  if (!gameActive) {
    return;
  }

  const rawValue = guessInput.value.trim();
  const userGuess = Number(rawValue);

  if (!rawValue || !Number.isInteger(userGuess)) {
    msg.textContent = "Please enter a whole number.";
    guessInput.focus();
    return;
  }

  if (userGuess < 1 || userGuess > level) {
    msg.textContent = `Please enter a number between 1 and ${level}.`;
    guessInput.select();
    return;
  }

  guessesThisRound += 1;

  if (userGuess === answer) {
    const endMs = Date.now();
    const rating = scoreRating(guessesThisRound);
    msg.textContent = `Correct! You needed ${guessesThisRound} guess${guessesThisRound === 1 ? "" : "es"} (${rating}).`;
    updateScore(guessesThisRound, true);
    updateTimers(endMs, true);
    reset();
    return;
  }

  const diff = Math.abs(userGuess - answer);
  const temperature = getTemperature(diff);
  const direction = userGuess > answer ? "high" : "low";

  msg.textContent = `You guessed ${userGuess}. Too ${direction}! ${temperature}.`;
  guessInput.value = "";
  if (typeof guess !== "undefined") {
    guess.value = "";
  }
  guessInput.focus();
}

function giveUp() {
  if (!gameActive) {
    return;
  }

  const endMs = Date.now();
  msg.textContent = `Game over. The correct number was ${answer}.`;

  updateScore(level, false);
  updateTimers(endMs, false);
  reset();
}

function updateScore(roundGuesses, won) {
  if (won) {
    totalWins += 1;
    totalGuesses += roundGuesses;
    scores.push(roundGuesses);
    scores.sort((a, b) => a - b);
  }

  renderScoreDisplay();
}

function renderScoreDisplay() {
  if (winsEl) {
    winsEl.textContent = `Total wins: ${totalWins}`;
  }

  if (avgScoreEl) {
    if (totalWins === 0) {
      avgScoreEl.textContent = "Average Score: N/A";
    } else {
      const average = (totalGuesses / totalWins).toFixed(2);
      avgScoreEl.textContent = `Average Score: ${average}`;
    }
  }

  leaderboardEls.forEach((item, index) => {
    item.textContent = scores[index] !== undefined ? scores[index] : "-";
  });
}

function updateTimers(endMs, won) {
  if (!startMs) {
    return;
  }

  const duration = endMs - startMs;
  totalGames += 1;
  totalTimeMs += duration;

  if (won && (fastestMs === null || duration < fastestMs)) {
    fastestMs = duration;
  }

  if (fastestEl) {
    fastestEl.textContent = fastestMs === null ? "Fastest Time: N/A" : `Fastest Time: ${formatDuration(fastestMs)}`;
  }

  if (avgTimeEl) {
    if (totalGames === 0) {
      avgTimeEl.textContent = "Average Time: N/A";
    } else {
      const averageDuration = totalTimeMs / totalGames;
      avgTimeEl.textContent = `Average Time: ${formatDuration(averageDuration)}`;
    }
  }
}

function reset() {
  gameActive = false;

  playBtn.disabled = false;
  guessBtn.disabled = true;
  if (giveUpBtn) {
    giveUpBtn.disabled = true;
  }

  levelRadios.forEach((radio) => {
    radio.disabled = false;
  });

  guessInput.placeholder = "";
  guessInput.value = "";
}

function getTemperature(diff) {
  const hotThreshold = Math.max(1, Math.floor(level * 0.1));
  const warmThreshold = Math.max(2, Math.floor(level * 0.25));

  if (diff <= hotThreshold) {
    return "Hot";
  }

  if (diff <= warmThreshold) {
    return "Warm";
  }

  return "Cold";
}

function scoreRating(guessCount) {
  const logTarget = Math.ceil(Math.log2(level + 1));

  if (guessCount <= logTarget) {
    return "excellent";
  }

  if (guessCount <= Math.ceil(level * 0.3)) {
    return "solid";
  }

  return "needs work";
}

function formatDuration(ms) {
  if (ms <= 0) {
    return "0.0s";
  }

  const totalSeconds = ms / 1000;
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }

  return `${totalSeconds.toFixed(1)}s`;
}
