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
  _gameStatesStack = [];

  constructor(rows, columns) {
    this._playfield = new Playfield(rows, columns);
    this._updatePieces();
  }

  get level() {
    return Math.floor(this._lines * 0.1);
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
    }
  }

  movePieceRight() {
    this._activePiece.x += 1;

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.x -= 1;
    }
  }

  movePieceDown() {
    if (this._topOut) return;

    this._activePiece.y += 1;

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.y -= 1;
      this._update();
    }
  }

  dropPiece() {
    if (this._topOut) return;

    // Move the piece down until it hits something
    while (!this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.y += 1;
    }

    // Move the piece up by one, as the last move caused a collision
    this._activePiece.y -= 1;

    // Lock the piece and update the game state
    this._update();
  }

  rotatePiece() {
    this._activePiece.rotate();

    if (this._playfield.hasCollision(this._activePiece)) {
      this._activePiece.rotate(false);
    }
  }

  // _update() {
  //   this._updatePlayfield();
  //   this._updateScore();
  //   this._updatePieces();

  //   if (this._playfield.hasCollision(this._activePiece)) {
  //     this._topOut = true;
  //   }
  // }

  // _updatePlayfield() {
  //   this._playfield.lockPiece(this._activePiece);
  // }

  // _updateScore() {
  //   const clearedLines = this._playfield.clearLines();

  //   if (clearedLines > 0) {
  //     this._score += Game.points[clearedLines] * (this.level + 1);
  //     this._lines += clearedLines;
  //   }
  // }

  // _updatePieces() {
  //   this._activePiece = this._nextPiece || new Piece();
  //   this._nextPiece = new Piece();
  //   console.log("_updatePieces", this._activePiece, this._nextPiece);
  //   this._activePiece.x = Math.floor(
  //     (this._playfield.columns - this._activePiece.width) / 2
  //   );
  //   this._activePiece.y = -1;
  // }

  // undo() {
  //   const previousState = this._gameStatesStack.pop();
  //   if (previousState) {
  //     this._score = previousState.score;
  //     this._lines = previousState.lines;
  //     this._topOut = previousState.topOut;
  //     this._activePiece = previousState.activePiece;
  //     this._nextPiece = previousState.nextPiece;
  //     this._playfield = previousState.playfield;
  //   }
  // }

  undo() {
    if (this._gameStatesStack.length > 1) {
      // Restore the previous game state from the stack
      this._gameStatesStack.pop();
      const previousState = this._gameStatesStack[this._gameStatesStack.length - 1];

      // Restore the game properties
      this._score = previousState.score;
      this._lines = previousState.lines;
      this._topOut = previousState.topOut;
      this._activePiece = previousState.activePiece;
      this._nextPiece = previousState.nextPiece;
      this._playfield = previousState.playfield;

      // Update the pieces' positions
      this._activePiece.x = previousState.activePiece.x;
      this._activePiece.y = previousState.activePiece.y;
      this._nextPiece.x = previousState.nextPiece.x;
      this._nextPiece.y = previousState.nextPiece.y;

      // Update the view
      this._update();
    }
  }

  _update() {
    // Update the game state
    this._updatePlayfield();
    this._updateScore();
    this._updatePieces();

    if (this._playfield.hasCollision(this._activePiece)) {
      this._topOut = true;
    }
  }

  _updatePlayfield() {
    this._playfield.lockPiece(this._activePiece);
  }

  _updateScore() {
    const clearedLines = this._playfield.clearLines();

    if (clearedLines > 0) {
      this._score += Game.points[clearedLines] * (this.level + 1);
      this._lines += clearedLines;
    }
  }

  _updatePieces() {
    this._activePiece = this._nextPiece || new Piece();
    this._nextPiece = new Piece();
    this._activePiece.x = Math.floor(
      (this._playfield.columns - this._activePiece.width) / 2
    );
    this._activePiece.y = -1;
  }
}
