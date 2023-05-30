export default class Controller {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this._isPlaying = false;
    this._interval = null;
    this._isMuted = false;

    this.difficultySelected = false; // Indicates if difficulty has been selected
    this.update = this.update.bind(this);
    this._isWelcomeScreen = true;

    view.on("keypress", this._handleKeyPress.bind(this));
    view.on("keydown", this._handleKeyDown.bind(this));
    view.on("keyup", this._handleKeyUp.bind(this));

    this._view.renderWelcomeScreen();
  }

  // Update function to move the piece down and update the view
  update() {
    if (this._isPlaying) {
      this._game.movePieceDown();
      this._updateView();
    }
  }

  // Pause the game audio
  pauseAudio() {
    let audio = document.getElementById("soundtrack");
    audio.pause();
  }

  // Play the pause effect sound
  playPauseEffect() {
    let pauseEffect = document.getElementById("pauseEffect");
    pauseEffect.play();
  }

  // Play the lock effect sound
  playLockEffect() {
    if (!this._isMuted) {
      let lockSound = document.getElementById("lockSound");
      lockSound.play();
    }
  }

  // Pause the lock effect sound
  pauseLockEffect() {
    let lockSound = document.getElementById("lockSound");
    lockSound.pause();
  }

  // Play the rotate effect sound
  playRotateEffect() {
    if (!this._isMuted) {
      let rotateSound = document.getElementById("rotate");
      rotateSound.play();
    }
  }

  // Pause the rotate effect sound
  pauseRotateEffect() {
    let rotateSound = document.getElementById("rotate");
    rotateSound.pause();
  }

  // Play the game over effect sound with a delay
  playGameOverEffect() {
    if (!this._isMuted) {
      const gameoverSound = document.getElementById("gameover");
      gameoverSound.play();

      setTimeout(() => {
        gameoverSound.pause();
      }, 2000); // Pause after 2 seconds (2000 milliseconds)
    }
  }

  // Resume the game audio
  resumeAudio() {
    let audio = document.getElementById("soundtrack");
    audio.play();
  }

  // Start the game
  play() {
    this._isWelcomeScreen = false;
    this._isPlaying = true;
    this._startTimer();
    this._updateView();
    if (!this._isMuted) {
      this.resumeAudio();
    }

    const background = document.getElementById("background");
    background.style.display = "none";

    const background_2 = document.getElementById("background-2");
    background_2.style.display = "block";

    const background_3 = document.getElementById("background-3");
    background_3.style.display = "none";

    const highscoreBox = document.getElementById("highscore-box");
    highscoreBox.style.display = "block";

    const highscoreBox_2 = document.getElementById("highscore-box-2");
    highscoreBox_2.style.display = "block";
  }

  // Pause the game
  pause() {
    this._isPlaying = false;
    this._stopTimer();
    this._updateView();
    if (!this._isMuted) {
      this.pauseAudio();
      this.playPauseEffect();
      this.pauseLockEffect();
      this.pauseRotateEffect();
    }
  }

  // Reset the game and start playing
  reset() {
    this._game.reset();
    this.play();
  }

  // Restart the game from the beginning
  restartGame() {
    this._game.reset();
    this._view.renderChoosingDifficulty(); // Render the start screen
    this._isPlaying = false; // The game should not be playing at the start screen
    this._stopTimer(); // Stop the game timer, if it's running

    const highscoreBox = document.getElementById("highscore-box");
    highscoreBox.style.display = "none";

    const highscoreBox_2 = document.getElementById("highscore-box-2");
    highscoreBox_2.style.display = "none";
  }

  // Update the game view based on the current state
  _updateView() {
    const state = this._game.state;

    if (state.isGameOver) {
      this._view.renderEndScreen(state);
      this.pauseAudio();
      this.playGameOverEffect();
    } else if (!this._isPlaying) {
      this._view.renderPauseScreen(state);
    } else {
      this._view.renderMainScreen(state);
    }
  }

  // Start the game timer
  _startTimer() {
    const speed = 1000 - this._game.level * 100;

    if (!this._interval) {
      this._interval = setInterval(() => {
        this.update();
      }, speed > 0 ? speed : 100);
    }
  }

  // Stop the game timer
  _stopTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  // Handle key press events
  _handleKeyPress(event) {
    if (this._isWelcomeScreen && event.keyCode !== 13) {
      return;
    }

    switch (event.keyCode) {
      case 13: // ENTER
        document.getElementById("name").blur();
        if (this.difficultySelected) {
          if (this._game.state.isGameOver) {
            this.reset();
          } else if (this._isPlaying) {
            this.pause();
            this.pauseLockEffect();
            this.pauseRotateEffect();
          } else {
            this.play();
          }
        } else {
          this.renderChoosingDifficulty();
        }
        break;
    }
  }

  // Toggle the mute state and update game and audio mute states accordingly
  _toggleMute() {
    this._isMuted = !this._isMuted;
    this._game._isSoundMuted = !this._game._isSoundMuted;

    if (this._isMuted) {
      this.pauseAudio();
      this.pauseLockEffect();
      this.pauseRotateEffect();
    } else {
      this.resumeAudio();
    }
  }

  _handleKeyDown(event) {
    if (this._isWelcomeScreen && event.keyCode !== 13) {
      return;
    }
    // Check if the game is not playing and the key is not 'R' or 'M'
    if (!this._isPlaying && event.keyCode !== 82 && event.keyCode !== 77) {
      return; // Do nothing if the game is paused and the key is not "R" or "M"
    }

    switch (event.keyCode) {
      case 37: // LEFT ARROW
        this._game.movePieceLeft();
        this._updateView();
        break;
      case 38: // UP ARROW
        this._game.rotatePiece();
        this.playRotateEffect();
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
        if (!this._isPlaying) {
          // This allows restarting the game when it's paused
          this.restartGame();
        }
        break;
      case 67: // 'c' key
        this._game._swapPiece();
        this._updateView();
        break;
      case 85: // U key
        if (this._isPlaying) {
          this._game.undo();
          this._updateView();
        }
        break;
      case 77: // M key
        // Removed check to allow muting/unmuting whether game is paused or not
        this._toggleMute();
        break;
    }
  }

  // Handle key up events
  _handleKeyUp(event) {
    if (this._isWelcomeScreen && event.keyCode !== 13) {
      return;
    }
    switch (event.keyCode) {
      case 40: // DOWN ARROW
        this._startTimer();
        break;
    }
  }

  // Render the difficulty selection screen
  renderChoosingDifficulty() {
    this._view.renderChoosingDifficulty();

    // Listen to user input for difficulty selection
    this._view.on("difficultySelected", (difficulty) => {
      this._game.setDifficulty(difficulty);
      this.difficultySelected = true;
      this._isPlaying = false;
      this._view.renderStartScreen();
    });

    const highscoreBox = document.getElementById("highscore-box");
    highscoreBox.style.display = "none";

    const highscoreBox_2 = document.getElementById("highscore-box-2");
    highscoreBox_2.style.display = "none";
  }
}
