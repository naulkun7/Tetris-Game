import Playfield from "./playfield.js";
import Piece from "./piece.js";
export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };

  _score = 0;
  _lines = 0;
  _topOut = false;
  _activePiece = null;
  _nextPiece = null;
  _ghostPiece = null;

  difficulty = null;
  _baseLevel = 0;
  _linesPerLevel = 10;

  _gameInProgress = false;

  constructor(rows, columns) {
    this._playfield = new Playfield(rows, columns);
    this._updatePieces();
    this._updateGhostPiece();
    this.baseLevel = 0;
    this.linesPerLevel = 10;
    this._speed = 1000; // Set initial speed to 1000 milliseconds
    this.setDifficulty = this.setDifficulty.bind(this); // Bind the method to the class instance
    document.addEventListener("keydown", (event) => {
      if (this._gameInProgress) {
        // Check if the game is in progress
        event.preventDefault(); // Prevent the default behavior of the keys

        // Handle other gameplay-related key actions here...
      } else {
        // Handle difficulty selection keys
        if (event.key.toLowerCase() === "e") {
          this.setDifficulty("easy");
        } else if (event.key.toLowerCase() === "n") {
          this.setDifficulty("normal");
        } else if (event.key.toLowerCase() === "h") {
          this.setDifficulty("hard");
        }
      }
    });
    this.gameLoop();
  }

  //Use to create gameSpeed
  get speed() {
    return this._speed - this.level * 50; // Decrease the speed by 50 milliseconds for each level
  }

  async gameLoop() {
    if (!this._topOut) {
      await this.delay(this.speed); // Delay the next loop iteration based on the current speed
      this.movePieceDown();
      this.gameLoop(); // Loop the function
    }
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
    console.log(this.linesPerLevel);
    console.log(this.baseLevel);
    return Math.floor(this._lines / this._linesPerLevel) + this._baseLevel;
  }

  get state() {
    return {
      score: this._score,
      level: this.level,
      lines: this._lines,
      playfield: this._playfield,
      activePiece: this._activePiece,
      nextPiece: this._nextPiece,
      isGameOver: this._topOut,
      ghostPiece: this._ghostPiece,
    };
  }

  reset() {
    this._score = 0;
    this._lines = 0;
    this._topOut = false;
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

  _update() {
    this._updatePlayfield();
    this._updateScore();
    this._updatePieces();
    this._updateGhostPiece();

    if (this._playfield.hasCollision(this._activePiece)) {
      this._topOut = true;
    } else {
      const level = this.level;
      const speed = 1000 - (level + this.baseLevel) * 100; // Decrease speed by 100 milliseconds per level

      setTimeout(() => {
        this.movePieceDown();
      }, speed);
    }
  }

  _updatePlayfield() {
    this._playLockSoundEffect();
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
    let clearLineAudio = document.getElementById("getScore");
    clearLineAudio.volume = 0.5;
    clearLineAudio.play();
  }

  _playLockSoundEffect() {
    // Play the sound effect here
    let lockSound = document.getElementById("lockSound");
    lockSound.play();
  }
}
