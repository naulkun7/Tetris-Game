export default class Controller {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this._isPlaying = false;
    this._interval = null;

    this.update = this.update.bind(this);

    view.on("keypress", this._handleKeyPress.bind(this));
    view.on("keydown", this._handleKeyDown.bind(this));
    view.on("keyup", this._handleKeyUp.bind(this));

    this._view.renderStartScreen();
  }

  update() {
    this._game.movePieceDown();
    this._updateView();
  }

  play() {
    this._isPlaying = true;
    this._startTimer();
    this._updateView();
  }

  pause() {
    this._isPlaying = false;
    this._stopTimer();
    this._updateView();
  }

  reset() {
    this._game.reset();
    this.play();
  }

  _updateView() {
    const state = this._game.state;

    if (state.isGameOver) {
      this._view.renderEndScreen(state);
    } else if (!this._isPlaying) {
      this._view.renderPauseScreen(state);
    } else {
      this._view.renderMainScreen(state);
    }
  }

  _startTimer() {
    const speed = 1000 - this._game.level * 100;

    if (!this._interval) {
      this._interval = setInterval(
        () => {
          this.update();
        },
        speed > 0 ? speed : 100
      );
    }
  }

  _stopTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _handleKeyPress(event) {
    switch (event.keyCode) {
      case 13: // ENTER
        if (this._game.state.isGameOver) {
          console.log(this._game.state);
          this.reset();
        } else if (this._isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
      case 117:
      case 85: // U
        this._game.undo();
        this._updateView();
        break;
    }
  }

  _handleKeyDown(event) {
    if (!this._isPlaying) {
      return; // Do nothing if the game is paused
    }

    switch (event.keyCode) {
      case 37: // LEFT ARROW
        this._game.movePieceLeft();
        this._updateView();
        break;
      case 38: // UP ARROW
        this._game.rotatePiece();
        this._updateView();
        break;
      case 39: // RIGHT ARROW
        this._game.movePieceRight();
        this._updateView();
        break;
      case 40: // DOWN ARROW
        this._stopTimer();
        this._game.movePieceDown();
        this._updateView();
        break;
      case 32: // SPACE
        this._game.dropPiece();
        this._updateView();
        break;
    }
  }

  _handleKeyUp(event) {
    switch (event.keyCode) {
      case 40: // DOWN ARROW
        this._startTimer();
        break;
    }
  }
}


