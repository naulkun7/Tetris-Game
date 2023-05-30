export default class Motion {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this.initialX = null;
    this.initialY = null;
    this.isSwipe = false;
    this.moveInterval = null;

    this._view.element.addEventListener(
      "touchstart",
      this.startTouch.bind(this),
      false
    );
    this._view.element.addEventListener(
      "touchmove",
      this.moveTouch.bind(this),
      false
    );
    this._view.element.addEventListener(
      "touchend",
      this.endTouch.bind(this),
      false
    );
  }

  startTouch(e) {
    this.initialX = e.touches[0].clientX;
    this.initialY = e.touches[0].clientY;
  }

  moveTouch(e) {
    if (this.initialX === null || this.initialY === null) {
      return;
    }

    let diffX = this.initialX - e.touches[0].clientX;
    let diffY = this.initialY - e.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Sliding horizontally
      if (diffX > 0) {
        // Swiped left
        this.moveLeft();
      } else {
        // Swiped right
        this.moveRight();
      }
    } else {
      // Sliding vertically
      if (diffY > 0) {
        // Swiped up
        this.rotate();
      } else {
        // Swiped down
        this.drop();
      }
    }

    this.isSwipe = true;
    this.initialX = null;
    this.initialY = null;
    e.preventDefault();
  }

  endTouch(e) {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    if (!this.isSwipe) {
      // Here you can determine what a simple tap does, e.g. rotating the Tetris piece
      this._game.rotatePiece();
    }
    this.isSwipe = false;
  }

  moveLeft() {
    this._game.movePieceLeft();
    if (!this.moveInterval) {
      this.moveInterval = setInterval(() => {
        this._game.movePieceLeft();
      }, 100);
    }
  }

  moveRight() {
    this._game.movePieceRight();
    if (!this.moveInterval) {
      this.moveInterval = setInterval(() => {
        this._game.movePieceRight();
      }, 100);
    }
  }

  rotate() {
    this._game.rotatePiece();
  }

  drop() {
    this._game.dropPiece();
  }
}
