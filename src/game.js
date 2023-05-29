import Playfield from "./playfield.js";
import Piece from "./piece.js";
export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };

  _name = document.getElementById("name").value;
  _score = 0;
  _lines = 0;
  _topOut = false;
  _activePiece = null;
  _nextPiece = null;
  _ghostPiece = null;
  _scoreArr = [
    { _name: "", _score: 0 },
    { _name: "", _score: 0 },
    { _name: "", _score: 0 },
  ];
  _baseLevel = 0;
  _linesPerLevel = 10;
  _isSoundMuted = false;
  _count = 0;
  _holdPiece = null;
  _hasSwapped = false;

  constructor(rows, columns) {
    this._playfield = new Playfield(rows, columns);
    this._updatePieces();
    this._updateGhostPiece();
    this._states = [];
    this.baseLevel = 0;
    this.linesPerLevel = 10;
    this._speed = 1000; // Set initial speed to 1000 milliseconds
    this._holdPiece = null;
    this._hasSwapped = false;
    this.setDifficulty = this.setDifficulty.bind(this); // Bind the method to the class instance
    document.addEventListener("difficultySelected", (event) => {
      this.setDifficulty(event.detail);
    });
    this.gameLoop();
  }

  // <----- Start Undo -----> //
  // Create a save to store state and push to the _stack[]
  saveState() {
    this._states.push({
      score: this._score,
      lines: this._lines,
      topOut: this._topOut,
      playfield: this._playfield.clone(),
      activePiece: this._activePiece.clone(),
      nextPiece: this._nextPiece.clone(),
      ghostPiece: this._ghostPiece.clone(),
    });
  }

  // Create a previous state to restore the game state from the _stack
  restoreState() {
    if (this._states.length > 0) {
      const prevState = this._states.pop();
      if (!this._playfield.hasCollision(prevState.activePiece)) {
        this._score = prevState.score;
        this._lines = prevState.lines;
        this._topOut = prevState.topOut;
        this._playfield = prevState.playfield;
        this._activePiece = prevState.activePiece;
        this._nextPiece = prevState.nextPiece;
        this._ghostPiece = prevState.ghostPiece;
      }
    }
  }

  undo() {
    this.restoreState();
  }
  // <----- End Undo -----> //

  //Use to create gameSpeed
  get speed() {
    return this._speed - this.level * 50; // Decrease the speed by 50 milliseconds for each level
  }

  gameLoop() {
    const loop = async () => {
      try {
        while (!this._topOut) {
          if (this._isPlaying) {
            await this.delay(this._speed); // Delay the next loop iteration based on the current speed
            this.movePieceDown();
          } else {
            await this.delay(100); // Delay the loop iteration by a fixed amount when the game is paused
          }
        }
      } catch (error) {
        console.error("An error occurred in the game loop:", error);
      }
    };

    loop().catch((error) => {
      console.error("An error occurred while starting the game loop:", error);
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // end of gameSpeed

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    if (difficulty === "easy") {
      this._linesPerLevel = 10;
      this._baseLevel = 0;
    } else if (difficulty === "normal") {
      this._linesPerLevel = 5;
      this._baseLevel = 1;
    } else if (difficulty === "hard") {
      this._linesPerLevel = 5;
      this._baseLevel = 5;
    }
  }

  get level() {
    return Math.floor(this._lines / this._linesPerLevel) + this._baseLevel;
  }

  get state() {
    return {
      score4: this._score4,
      name: this._name,
      score: this._score,
      level: this.level,
      lines: this._lines,
      playfield: this._playfield,
      activePiece: this._activePiece,
      nextPiece: this._nextPiece,
      isGameOver: this._topOut,
      ghostPiece: this._ghostPiece,
      name1: this._name1,
      score1: this._score1,
      name2: this._name2,
      score2: this._score2,
      count: this._count,
      holdPiece: this._holdPiece,
      scoreArr: this._scoreArr,
    };
  }

  reset() {
    this._count++;
    this._score = 0;
    this._lines = 0;
    this._topOut = false;
    this._holdPiece = null;
    this._playfield.reset();
    this._updatePieces();
  }

  movePieceLeft() {
    this._activePiece.x -= 1;

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.x += 1;
    } else {
      this._updateGhostPiece();
    }
  }

  movePieceRight() {
    this._activePiece.x += 1;

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.x -= 1;
    } else {
      this._updateGhostPiece();
    }
  }

  movePieceDown() {
    if (this._topOut) return;

    this._activePiece.y += 1;

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.y -= 1;
      this._update();
    } else {
      this._updateGhostPiece();
    }
  }

  dropPiece() {
    this.saveState(); // <-- save state before the move
    if (this._topOut) return;

    let cellsDropped = 0;

    // Move the piece down until it hits something
    while (!this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.y += 1;
      cellsDropped++;
    }

    // Move the piece up by one, as the last move caused a collision
    this._activePiece.y -= 1;

    // Lock the piece and update the game state
    this._update();

    // Update the score based on the number of cells dropped
    this._score += cellsDropped * 2;
  }

  rotatePiece() {
    const initialX = this._activePiece.x; // Store the initial x-coordinate of the active piece
    const maxShifts = 3; // Maximum number of shifts to try before reverting the rotation

    this._activePiece.rotate();
    this._ghostPiece.rotate();

    if (this._playfield.hasCollision(this._activePiece)) {
      let shiftDirection =
        this._activePiece.x <= this._playfield.columns / 2 ? 1 : -1;
      let shifts = 0;

      // Shift the active piece horizontally until it doesn't collide or the maxShifts is reached
      while (
        this._playfield.hasCollision(this._activePiece) &&
        shifts < maxShifts
      ) {
        this._activePiece.x += shiftDirection;
        shifts++;
      }

      // If the shifted piece still collides after the maxShifts, revert the rotation
      if (this._playfield.hasCollision(this._activePiece)) {
        this._activePiece.rotateCounterClockwise();
        this._activePiece.x = initialX; // Restore the initial x-coordinate
        return;
      }

      this._ghostPiece.x = this._activePiece.x;
      this._ghostPiece.y = this._activePiece.y;
    }

    this._updateGhostPiece(); // Update the ghost piece's position after rotation
  }

  _swapPiece() {
    if (!this._hasSwapped) {
      if (!this._holdPiece) {
        this._holdPiece = this._activePiece;
        this._activePiece = this._nextPiece; // Get the next piece from the queue
        this._nextPiece = new Piece();
        // Reset the position of the active piece
        this._activePiece.x = Math.floor(
          (this._playfield.columns - this._activePiece.width) / 2
        );
        this._activePiece.y = -1;
      } else {
        let temp = this._activePiece;
        this._activePiece = this._holdPiece;
        this._holdPiece = temp;
        this._activePiece.x = Math.floor(
          (this._playfield.columns - this._activePiece.width) / 2
        );
        this._activePiece.y = -1;
      }

      // Set the position of the held piece within the "Hold" area
      this._holdPiece.x = 0;
      this._holdPiece.y = 0;
      this._hasSwapped = true;

      // Generate new Ghost piece for the new piece generated
      this._ghostPiece = new Piece(
        this._activePiece.type,
        this._activePiece.x,
        this._activePiece.y
      );

      // Ensure the ghost piece has the same rotation state as the active piece
      while (
        this._ghostPiece.blocks.toString() !=
        this._activePiece.blocks.toString()
      ) {
        this._ghostPiece.rotate();
      }

      this._updateGhostPiece();
    }
  }

  _update() {
    this._updatePlayfield();

    //Check player number
    for (let i = 0; i < 3; i++) {
      if (this._count == i) {
        this._updateScore();
        this._scoreArr[i]._score = this._score;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (this._count == i) {
        this._updateName();
        this._scoreArr[i]._name = this._name;
      }
    }

    this._updatePieces();
    this._updateGhostPiece();
    this._updateScore();

    if (this._playfield.hasCollision(this._activePiece)) {
      this._topOut = true;
    } else {
      const level = this.level;
      const speed = 1000 - (level + this.baseLevel) * 100; // Decrease speed by 100 milliseconds per level

      setTimeout(() => {
        this.movePieceDown();
      }, speed);
    }

    // Reset the swap flag when a new piece becomes active
    this._hasSwapped = false;
  }

  _updatePlayfield() {
    this._playfield.lockPiece(this._activePiece);
  }

  _updateScore() {
    const clearedLines = this._playfield.clearLines();

    if (clearedLines > 0) {
      this._playClearLineSoundEffect();
      this._score += Game.points[clearedLines] * (this.level + 1);
      this._lines += clearedLines;
    }
  }
  _updateName() {
    this._name = document.getElementById("name").value;
  }
  _updateName1() {
    this._name1 = document.getElementById("name").value;
  }
  _updateName2() {
    this._name2 = document.getElementById("name").value;
  }

  _updatePieces() {
    this._activePiece = this._nextPiece || new Piece();
    this._nextPiece = new Piece();
    console.log("_updatePieces", this._activePiece, this._nextPiece);
    this._activePiece.x = Math.floor(
      (this._playfield.columns - this._activePiece.width) / 2
    );
    this._activePiece.y = 0;
    this._ghostPiece = new Piece(
      this._activePiece.type,
      this._activePiece.x,
      this._activePiece.y
    );
  }

  _updateGhostPiece() {
    // Update the position of the ghost piece to be directly below the active piece
    this._ghostPiece.x = this._activePiece.x;
    this._ghostPiece.y = this._activePiece.y;

    while (!this._playfield.hasCollision(this._ghostPiece)) {
      this._ghostPiece.y += 1;
    }

    // Move the ghost piece up by one, as the last move caused a collision
    this._ghostPiece.y -= 1;
  }

  _playClearLineSoundEffect() {
    if (this._isSoundMuted) {
      let clearLineAudio = document.getElementById("getScore");
      clearLineAudio.volume = 0.5;
      clearLineAudio.play();
    }
  }
}
