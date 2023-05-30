export default class Motion {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this.initialX = null;
    this.initialY = null;

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
      this.tapTouch.bind(this),
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
        this._game.movePieceLeft();
      } else {
        // Swiped right
        this._game.movePieceRight();
      }
    } else {
      // Sliding vertically
      if (diffY > 0) {
        // Swiped up
        this._game.rotatePiece();
      } else {
        // Swiped down
        this._game.dropPiece();
      }
    }

    this.initialX = null;
    this.initialY = null;

    e.preventDefault();
  }

  tapTouch(e) {
    // Here you can determine what a simple tap does, e.g. rotating the Tetris piece
    this._game.rotatePiece();
  }
}
