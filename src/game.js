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
  // _gameStatesStack = [];

  constructor(rows, columns) {
    this._playfield = new Playfield(rows, columns);
    this._updatePieces();
    this._gameStatesStack = [];
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

  undo() {
    if (this._gameStatesStack.length > 1) {
      // Restore the previous game state from the stack
      const currentState = this._gameStatesStack.pop();
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

      // Clear the playfield and relock the pieces
      this._playfield.reset();
      this._updatePlayfield();

      // Update the view
      this._updateView();
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

    const currentState = {
      score: this._score,
      lines: this._lines,
      topOut: this._topOut,
      activePiece: this._activePiece,
      nextPiece: this._nextPiece,
      playfield: this._playfield,
    };
    this._gameStatesStack.push(currentState);
  }

  _updatePlayfield() {
    this._playfield.lockPiece(this._activePiece);

    // Lock the active piece and restore the playfield
    this._playfield.lockPiece(this._activePiece);
    for (let block of this._playfield) {
      if (block && block !== this._activePiece) {
        this._playfield[block.y][block.x] = block;
      }
    }
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

  _updateView() {
    // Clear the previous view
    this._clearView();

    // Render the playfield
    for (let y = 0; y < this._playfield.length; y++) {
      for (let x = 0; x < this._playfield[y].length; x++) {
        const block = this._playfield[y][x];
        if (block) {
          this._renderBlock(x, y, block.color);
        }
      }
    }

    // Render the active piece
    for (let block of this._activePiece.blocks) {
      const x = this._activePiece.x + block.x;
      const y = this._activePiece.y + block.y;
      this._renderBlock(x, y, this._activePiece.color);
    }

    // Render the next piece
    for (let block of this._nextPiece.blocks) {
      const x = this._nextPiece.x + block.x;
      const y = this._nextPiece.y + block.y;
      this._renderBlock(x, y, this._nextPiece.color);
    }

    // Render the score and lines
    // Replace the following lines with your specific rendering logic
    console.log('Score:', this._score);
    console.log('Lines:', this._lines);
  }

  _clearView() {
    // Replace this method with your specific view clearing logic
    // For example, if you're rendering on a canvas, you would clear the canvas here
  }

  _renderBlock(x, y, color) {
    // Replace this method with your specific block rendering logic
    // For example, if you're rendering on a canvas, you would draw a colored rectangle here
    console.log('Render block at', x, y, 'with color', color);
  }
}
