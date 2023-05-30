import Game from "./src/game.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";
import VirtualKeyboard from "./src/mobile/virtualkeyboard.js";
import Motion from "./src/mobile/motion.js";

const GRID_ROWS = 20;
const GRID_COLUMNS = 10;

const element = document.querySelector("#root");

const game = new Game(GRID_ROWS, GRID_COLUMNS);
const view = new View({
  element,
  width: 720,
  height: 640,
  rows: GRID_ROWS,
  columns: GRID_COLUMNS,
});

const controller = new Controller(game, view);
const motion = new Motion(game, view);
const virtualKeyboard = new VirtualKeyboard();

let audio = document.getElementById("soundtrack");
audio.volume = 0.1;
