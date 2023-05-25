import Playfield from "./playfield.js";
import Piece from "./piece.js";
export default class Game {
  static points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  // name1 = new name();
  // controll = new Controller
  _name = document.getElementById("name").value;

  _score = 0;
  _lines = 0;
  _topOut = false;
  _activePiece = null;
  _nextPiece = null;
  _name1 = ""
  _score1 = 0;
  _name2 = ""
  _score2 = 0;
  _score4 = 0;
  _count = 0;
  constructor(rows, columns) {
    this._playfield = new Playfield(rows, columns);
    this._updatePieces();

  }

  get level() {
    return Math.floor(this._lines * 0.1);
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
      name1: this._name1,
      score1: this._score1,
      name2: this._name2,
      score2: this._score2,
      count: this._count,
    };
  }

  reset() {
    this._count++;
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

  _update() {
    this._updatePlayfield();
    if (this._count == 0) {
      this._updateScore();
      this._score4 = this._score
    }
    if (this._count == 1) {
      this._updateScore();
      this._score1 = this._score
    }

    if (this._count == 2) {
      this._updateScore();
      this._score2 = this._score
    }
    this._updatePieces();
    if (this._count == 0) {
      this._updateName();
    }
    if (this._count == 1) {
      this._updateName1();
    }
    if (this._count == 2) {
      this._updateName2();
    }
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
  _updateScore1() {
    const clearedLines = this._playfield.clearLines();

    if (clearedLines > 0) {
      this._score1 += Game.points[clearedLines] * (this.level + 1);
      this._lines += clearedLines;
    }
  }
  _updateScore2() {
    const clearedLines = this._playfield.clearLines();

    if (clearedLines > 0) {
      this._score2 += Game.points[clearedLines] * (this.level + 1);
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
    this._activePiece.y = -1;
  }
}
