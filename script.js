"use strict";

const breakDecrement = document.getElementById("break-decrement");
const breakIncrement = document.getElementById("break-increment");
const sessionDecrement = document.getElementById("session-decrement");
const sessionIncrement = document.getElementById("session-increment");

const breakLengthDisplay = document.getElementById("break-length");
const sessionLengthDisplay = document.getElementById("session-length");

const timerLabel = document.getElementById("timer-label");
const timeLeft = document.getElementById("time-left");

const startStopBtn = document.getElementById("start_stop");
const resetBtn = document.getElementById("reset");

const beep = document.getElementById("beep");

let breakLength = 5;
let sessionLength = 25;

let timer = null;
let timeRemaining = sessionLength * 60;
let isRunning = false;
let isSession = true;

// Helper to update the time-left display in mm:ss
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timeLeft.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Helper to flash timer-label on session/break switch
function flashTimerLabel() {
  timerLabel.classList.remove("timer-label-flash"); // reset
  void timerLabel.offsetWidth; // trigger reflow to restart animation
  timerLabel.classList.add("timer-label-flash");
}

// Switch between session and break
function switchSessionBreak() {
  isSession = !isSession;
  timerLabel.textContent = isSession ? "Session" : "Break";

  flashTimerLabel();

  timeRemaining = (isSession ? sessionLength : breakLength) * 60;
  updateTimerDisplay();
  beep.play();
}

// Decrement / Increment handlers with constraints 1-60
function changeBreakLength(amount) {
  if (isRunning) return; // prevent changes while running
  breakLength = Math.min(60, Math.max(1, breakLength + amount));
  breakLengthDisplay.textContent = breakLength;

  // If break timer is active, update display accordingly
  if (!isSession) {
    timeRemaining = breakLength * 60;
    updateTimerDisplay();
  }
}

function changeSessionLength(amount) {
  if (isRunning) return; // prevent changes while running
  sessionLength = Math.min(60, Math.max(1, sessionLength + amount));
  sessionLengthDisplay.textContent = sessionLength;

  // If session timer is active, update display accordingly
  if (isSession) {
    timeRemaining = sessionLength * 60;
    updateTimerDisplay();
  }
}

// Timer countdown function
function countdown() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateTimerDisplay();
  } else {
    switchSessionBreak();
  }
}

// Start or pause the timer
function startPauseTimer() {
  if (isRunning) {
    clearInterval(timer);
    timer = null;
    isRunning = false;
  } else {
    timer = setInterval(countdown, 1000);
    isRunning = true;
  }
}

// Reset everything
function resetTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;

  breakLength = 5;
  sessionLength = 25;
  isSession = true;
  timeRemaining = sessionLength * 60;

  breakLengthDisplay.textContent = breakLength;
  sessionLengthDisplay.textContent = sessionLength;
  timerLabel.textContent = "Session";
  updateTimerDisplay();

  beep.pause();
  beep.currentTime = 0;
}

// Event listeners
breakDecrement.addEventListener("click", () => changeBreakLength(-1));
breakIncrement.addEventListener("click", () => changeBreakLength(1));

sessionDecrement.addEventListener("click", () => changeSessionLength(-1));
sessionIncrement.addEventListener("click", () => changeSessionLength(1));

startStopBtn.addEventListener("click", startPauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize display on load
updateTimerDisplay();
