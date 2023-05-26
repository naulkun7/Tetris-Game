export default class View {
  static colors = {
    I: "#00ffff",
    J: "#0000ff",
    L: "#ff7f00",
    O: "#ffff00",
    S: "#00ff00",
    T: "#800080",
    Z: "#ff0000",
  };

  constructor({ element, width, height, rows, columns }) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.adjustCanvasSize();
    window.addEventListener("resize", () => this.adjustCanvasSize());

    this.context = this.canvas.getContext("2d");

    this.playfieldBorderWidth = 4;
    this.playfieldX = this.playfieldBorderWidth;
    this.playfieldY = this.playfieldBorderWidth;
    this.playfieldWidth = (this.width * 2) / 3;
    this.playfieldHeight = this.height;
    this.playfieldInnerWidth =
      this.playfieldWidth - this.playfieldBorderWidth * 2;
    this.playfieldInnerHeight =
      this.playfieldHeight - this.playfieldBorderWidth * 2;

    this.blockWidth = this.playfieldInnerWidth / columns;
    this.blockHeight = this.playfieldInnerHeight / rows;

    this.panelX = this.playfieldWidth + 10;
    this.panelY = 0;
    this.panelWidth = this.width / 3;
    this.panelHeight = this.height;

    this.element.appendChild(this.canvas);
  }

  adjustCanvasSize() {
    const isMobile = window.innerWidth < 768; // Adjust the threshold as needed
    const maxWidth = Math.min(window.innerWidth, this.width);
    const maxHeight = Math.min(window.innerHeight, this.height);
    let canvasWidth, canvasHeight;

    if (isMobile) {
      const totalColumns = 3;
      const mainColumnWidthRatio = 7 / totalColumns;
      const aspectRatio = mainColumnWidthRatio / (mainColumnWidthRatio + 1);

      if (maxWidth / maxHeight > aspectRatio) {
        canvasWidth = maxHeight * aspectRatio;
        canvasHeight = maxHeight;
      } else {
        canvasWidth = maxWidth;
        canvasHeight = maxWidth / aspectRatio;
      }
    } else {
      canvasWidth = this.width;
      canvasHeight = this.height;
    }

    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
  }

  on(event, handler) {
    document.addEventListener(event, handler);
  }

  renderWelcomeScreen() {
    this._clearScreen();

    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("WELCOME", this.width / 2, this.height / 2 - 30);
  }

  renderStartScreen() {
    this._clearScreen();

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      "Press ENTER to Start",
      this.width / 2,
      this.height / 3
    );

    // Render tutorial text below the "Press ENTER to Start" text
    this.context.font = '10px "Press Start 2P"';
    this.context.fillText("TUTORIAL", this.width / 2, this.height / 2 + 40);

    this.context.fillText(
      "Use the <-|-> to move left and right",
      this.width / 2,
      this.height / 2 + 60
    );

    this.context.fillText(
      "Use space to drop down",
      this.width / 2,
      this.height / 2 + 80
    );
  }

  renderChoosingDifficulty() {
    this._clearScreen();

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("Choose Difficulty", this.width / 2, this.height / 3);

    this.context.font = '16px "Press Start 2P"';
    this.context.fillText("Press E for EASY", this.width / 2, this.height / 2);

    this.context.fillText(
      "Press N for NORMAL",
      this.width / 2,
      this.height / 2 + 40
    );
    this.context.fillText(
      "Press H for HARD",
      this.width / 2,
      this.height / 2 + 80
    );

    // Listen to user input
    this.on("keydown", (event) => {
      if (event.key.toLowerCase() === "e") {
        document.dispatchEvent(
          new CustomEvent("difficultySelected", { detail: "easy" })
        );
      } else if (event.key.toLowerCase() === "n") {
        document.dispatchEvent(
          new CustomEvent("difficultySelected", { detail: "normal" })
        );
      } else if (event.key.toLowerCase() === "h") {
        document.dispatchEvent(
          new CustomEvent("difficultySelected", { detail: "hard" })
        );
      }
    });
  }

  renderMainScreen(state) {
    this._clearScreen();
    this._renderPlayfield(state);
    this._renderGrid(); // render the grid after playfield
    this._renderPanel(state);
    this._renderBorder();
  }

  renderPauseScreen() {
    this._clearScreen("rgba(0, 0, 0, 0.75)");

    this.context.fillStyle = "white";
    this.context.font = '16px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("PAUSE", this.width / 2, this.height / 2 - 48);
    this.context.fillText(
      "Press ENTER to Resume",
      this.width / 2,
      this.height / 2
    );
    this.context.fillText(
      "Press R to Restart",
      this.width / 2,
      this.height / 2 + 48
    );
    this.context.fillText(
      "Press 0 to MUTE ALL",
      this.width / 2,
      this.height / 2 + 96
    );
  }

  renderEndScreen({ score4, name, score1, name1, score2, name2 }) {
    this._clearScreen();

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("GAME OVER", this.width / 2, this.height / 2 - 48);


    this.context.fillText(`Name: ${name}`, this.width / 2 - 100, this.height / 2 + 25);
    this.context.fillText(`Score: ${score4}`, this.width / 2 + 150, this.height / 2 + 25);

    this.context.fillText(`Name: ${name1}`, this.width / 2 - 100, this.height / 2 + 50);
    this.context.fillText(`Score: ${score1}`, this.width / 2 + 150, this.height / 2 + 50);

    this.context.fillText(`Name: ${name2}`, this.width / 2 - 100, this.height / 2 + 75);
    this.context.fillText(`Score: ${score2}`, this.width / 2 + 150, this.height / 2 + 75);


    this.context.fillText(
      "Press ENTER to Restart",
      this.width / 2,
      this.height / 2 + 200
    );
  }


  _clearScreen(color = "black") {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  _renderBorder() {
    this.context.strokeStyle = "white";
    this.context.lineWidth = this.playfieldBorderWidth;
    this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
  }

  _renderPlayfield({ playfield, activePiece, ghostPiece }) {
    for (let y = 0; y < playfield.length; y++) {
      const line = playfield[y];

      for (let x = 0; x < line.length; x++) {
        const block = playfield[y][x];

        if (block) {
          this._renderBlock({
            x: this.playfieldX + x * this.blockWidth,
            y: this.playfieldY + y * this.blockHeight,
            width: this.blockWidth,
            height: this.blockHeight,
            color: View.colors[block.type],
          });
        }
      }
    }

    this._renderPiece(activePiece, {
      x: this.playfieldX,
      y: this.playfieldY,
      width: this.blockWidth,
      height: this.blockHeight,
    });

    this._renderPiece(
      ghostPiece,
      {
        x: this.playfieldX,
        y: this.playfieldY,
        width: this.blockWidth,
        height: this.blockHeight,
      },
      "rgba(127,127,127,0.5)"
    ); // Render the ghost piece in a different style
  }

  _renderPanel({ level, score, lines, nextPiece, holdPiece }) {
    this.context.textAlign = "start";
    this.context.textBaseline = "top";
    this.context.fillStyle = "white";
    this.context.font = '14px "Press Start 2P"';

    this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + 0);
    this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 24);
    this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 48);
    this.context.fillText("Next:", this.panelX, this.panelY + 96);
    this.context.fillText("Hold:", this.panelX, this.panelY + 192);

    if (nextPiece) {
      this._renderPiece(nextPiece, {
        x: this.panelX,
        y: this.panelY + 120,
        width: this.blockWidth * 0.5,
        height: this.blockHeight * 0.5,
        // color: "white", 
      });
    }

    if (holdPiece) {
      this._renderPiece(holdPiece, {
        x: this.panelX,
        y: this.panelY + 220,
        width: this.blockWidth * 0.5,
        height: this.blockHeight * 0.5,
        // color: "white",
      });
  }
  }

  _renderPiece(
    piece,
    { x, y, width = this.blockWidth, height = this.blockHeight, color = null }
  ) {
    for (let block of piece) {
      if (block) {
        this._renderBlock({
          x: x + block.x * width,
          y: y + block.y * height,
          width,
          height,
          color: color || View.colors[block.type],
        });
      }
    }
  }

  _renderBlock({ x, y, width, height, color, lineWidth }) {
    this.context.fillStyle = color;
    this.context.strokeStyle = "black";
    this.context.lineWidth = lineWidth;

    // Add box-shadow properties
    this.context.shadowColor = "rgba(0, 0, 0, 0.16)";
    this.context.shadowBlur = 6;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 3;

    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);

    // Add additional box-shadow properties for a second shadow
    this.context.shadowColor = "rgba(0, 0, 0, 0.23)";
    this.context.shadowBlur = 6;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 3;

    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);

    // Reset box-shadow properties
    this.context.shadowColor = "transparent";
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
  }

  _renderGrid() {
    this.context.strokeStyle = "white";
    this.context.lineWidth = 0.5;

    // Vertical lines
    for (let i = 0; i <= this.playfieldInnerWidth; i += this.blockWidth) {
      this.context.beginPath();
      this.context.moveTo(this.playfieldX + i, this.playfieldY);
      this.context.lineTo(
        this.playfieldX + i,
        this.playfieldY + this.playfieldInnerHeight
      );
      this.context.stroke();
    }

    // Horizontal lines
    for (let i = 0; i <= this.playfieldInnerHeight; i += this.blockHeight) {
      this.context.beginPath();
      this.context.moveTo(this.playfieldX, this.playfieldY + i);
      this.context.lineTo(
        this.playfieldX + this.playfieldInnerWidth,
        this.playfieldY + i
      );
      this.context.stroke();
    }
  }
}
