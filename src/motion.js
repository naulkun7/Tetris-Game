export default class Motion {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this.initialX = null;
    this.initialY = null;
    this.startTime = null;
    this.threshold = 20; // modify this value to adjust sensitivity
    this.timeLimit = 200; // maximum time in ms between touchstart and touchend to be considered a tap

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
      this.endTouch.bind(this), // Change this to endTouch
      false
    );
  }

  startTouch(e) {
    this.initialX = e.touches[0].clientX;
    this.initialY = e.touches[0].clientY;
    this.startTime = new Date().getTime(); // record the time at touchstart
  }

  moveTouch(e) {
    if (this.initialX === null || this.initialY === null) {
      return;
    }

    let diffX = this.initialX - e.touches[0].clientX;
    let diffY = this.initialY - e.touches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Sliding horizontally
      if (Math.abs(diffX) > this.threshold) {
        // Add this line
        if (diffX > 0) {
          // Swiped left
          this._game.movePieceLeft();
        } else {
          // Swiped right
          this._game.movePieceRight();
        }
      }
    } else {
      // Sliding vertically
      if (Math.abs(diffY) > this.threshold) {
        // Add this line
        if (diffY > 0) {
          // Swiped up
          this._game.rotatePiece();
        } else {
          // Swiped down
          this._game.dropPiece();
        }
      }
    }

    this.initialX = null;
    this.initialY = null;

    e.preventDefault();
  }

  endTouch(e) {
    // Here you check the elapsed time to differentiate between a swipe and a tap
    if (new Date().getTime() - this.startTime < this.timeLimit) {
      // if the time between touchstart and touchend is less than timeLimit, it's considered a tap
      this.tapTouch(e);
    }
  }

  tapTouch(e) {
    // Here you can determine what a simple tap does, e.g. rotating the Tetris piece
    this._game.rotatePiece();
  }
}
