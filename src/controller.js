export default class Controller {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this._isPlaying = false;
    this._interval = null;
    this._isMuted = true;

    this.difficultySelected = false; // Add this
    this.update = this.update.bind(this);

    view.on("keypress", this._handleKeyPress.bind(this));
    view.on("keydown", this._handleKeyDown.bind(this));
    view.on("keyup", this._handleKeyUp.bind(this));

    this._view.renderWelcomeScreen();
  }

  update() {
    if (this._isPlaying) {
      this._game.movePieceDown();
      this._updateView();
    }
  }

  pauseAudio() {
    let audio = document.getElementById("soundtrack");
    audio.pause();
  }

  pause_Effect() {
    let pauseEffect = document.getElementById("pauseEffect");
    pauseEffect.play();
  }

  playLockEffect() {
    if (!this._isMuted) {
      let lockSound = document.getElementById("lockSound");
      lockSound.play();
    }
  }

  pauseLockEffect() {
    let lockSound = document.getElementById("lockSound");
    lockSound.pause();
  }

  resumeAudio() {
    let audio = document.getElementById("soundtrack");
    audio.play();
  }

  play() {
    this._isPlaying = true;
    this._startTimer();
    this._updateView();
    if (!this._isMuted) {
      this.resumeAudio();
    }
  }

  pause() {
    this._isPlaying = false;
    this._stopTimer();
    this._updateView();
    if (!this._isMuted) {
      this.pauseAudio();
      this.pause_Effect();
      this.pauseLockEffect();
    }
  }

  reset() {
    this._game.reset();
    this.play();
  }

  restartGame() {
    this._game.reset(); // Assuming this method resets your game
    this._view.renderChoosingDifficulty(); // Render the start screen
    this._isPlaying = false; // The game should not be playing at the start screen
    this._stopTimer(); // Stop the game timer, if it's running
  }

  _updateView() {
    const state = this._game.state;

    if (state.isGameOver) {
      this._view.renderEndScreen(state);
      this.pauseAudio();
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
        if (this.difficultySelected) {
          if (this._game.state.isGameOver) {
            this.reset();
          } else if (this._isPlaying) {
            this.pause();
            this.pauseLockEffect();
          } else {
            this.play();
          }
        } else {
          this.renderChoosingDifficulty();
        }
        break;
      case 48: // 0 key
        this._toggleMute();
        break;
    }
  }

  _toggleMute() {
    this._isMuted = !this._isMuted;
    this._game._isSoundMuted = !this._game._isSoundMuted;

    if (this._isMuted) {
      this.pauseAudio();
      this.pauseLockEffect(); // Pause the lock effect sound
    } else {
      this.resumeAudio();
    }
  }

  _handleKeyDown(event) {
    if (!this._isPlaying && event.keyCode !== 82) {
      return; // Do nothing if the game is paused and the key is not "R"
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
        this._game._score += 1;
        break;
      case 32: // SPACE
        if (this._isPlaying) {
          this._game.dropPiece();
          this.playLockEffect();
          this._updateView();
        }
        break;
      case 82: // R key
        if (event.repeat) {
          return; // Do nothing if the R key is held down
        }
        this.restartGame();
        break;
      case 85: // U key
        if (this._isPlaying) {
          this._game.undo();
          this._updateView();
        }
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

  renderChoosingDifficulty() {
    // Render choosing difficulty screen
    this._view.renderChoosingDifficulty();

    // Listen to user input for difficulty selection
    this._view.on("difficultySelected", (difficulty) => {
      this._game.setDifficulty(difficulty); // Assuming this method changes game's difficulty
      this.difficultySelected = true;
      this._isPlaying = false;
      this._view.renderStartScreen(); // Re-render the start screen
    });
  }
}