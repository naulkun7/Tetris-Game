import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const GRID_ROWS = 20;
const GRID_COLUMNS = 10;

const element = document.querySelector("#root");

const game = new Game(GRID_ROWS, GRID_COLUMNS);
const view = new View({
  element,
  width: 480,
  height: 640,
  rows: GRID_ROWS,
  columns: GRID_COLUMNS,
});

const controller = new Controller(game, view);

let audio = document.getElementById("soundtrack");
audio.volume = 0.1;

document.getElementById("left-button").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Left button clicked");
  simulateArrowKeyPress("ArrowLeft");
});

document.getElementById("right-button").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Right button clicked");
  simulateArrowKeyPress("ArrowRight");
});

document.getElementById("up-button").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Up button clicked");
  simulateArrowKeyPress("ArrowUp");
});

document.getElementById("down-button").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Down button clicked");
  simulateArrowKeyPress("ArrowDown");
});

function simulateArrowKeyPress(key) {
  const keyCodes = {
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
  };

  const keyCode = keyCodes[key];
  if (!keyCode) {
    return; // Ignore keys other than arrow keys
  }

  const delay = 100; // Delay in milliseconds between key presses

  setTimeout(function () {
    const keyDownEvent = new KeyboardEvent("keydown", { keyCode: keyCode });
    const keyPressEvent = new KeyboardEvent("keypress", { keyCode: keyCode });
    const keyUpEvent = new KeyboardEvent("keyup", { keyCode: keyCode });

    document.dispatchEvent(keyDownEvent);
    document.dispatchEvent(keyPressEvent);
    document.dispatchEvent(keyUpEvent);
  }, delay);
}
