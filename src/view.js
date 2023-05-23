export default class View {
  static colors = {
    I: "cyan",
    J: "blue",
    L: "orange",
    O: "yellow",
    S: "green",
    T: "purple",
    Z: "red",
  };

  constructor({ element, width, height, rows, columns }) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
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

  on(event, handler) {
    document.addEventListener(event, handler);
  }

  renderStartScreen() {
    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      "Press ENTER to Start",
      this.width / 2,
      this.height / 2
    );
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
  }

  renderEndScreen({ score }) {
    this._clearScreen();

    this.context.fillStyle = "white";
    this.context.font = '18px "Press Start 2P"';
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("GAME OVER", this.width / 2, this.height / 2 - 48);
    this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
    this.context.fillText(
      "Press ENTER to Restart",
      this.width / 2,
      this.height / 2 + 48
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

  _renderPlayfield({ playfield, activePiece }) {
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

    this._renderPiece(nextPiece, {
      x: this.panelX,
      y: this.panelY + 120,
      width: this.blockWidth * 0.5,
      height: this.blockHeight * 0.5,
    });

    this.context.fillText("Hold:", this.panelX, this.panelY + 196);

    if (holdPiece) {
      this._renderPiece(holdPiece, {
        x: this.panelX,
        y: this.panelY + 220,
        width: this.blockWidth * 0.5,
        height: this.blockHeight * 0.5,
      });
  }
  }

  _renderPiece(
    piece,
    { x, y, width = this.blockWidth, height = this.blockHeight }
  ) {
    for (let block of piece) {
      if (block) {
        this._renderBlock({
          x: x + block.x * width,
          y: y + block.y * height,
          width,
          height,
          color: View.colors[block.type],
        });
      }
    }
  }

  _renderBlock({ x, y, width, height, lineWidth = 2, color = "black" }) {
    this.context.fillStyle = color;
    this.context.strokeStyle = "black";
    this.context.lineWidth = lineWidth;
    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
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
