export default class Piece {
  static blocks = {
    I: () => [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: () => [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    L: () => [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    O: () => [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    S: () => [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    T: () => [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    Z: () => [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
  };

  static types = Object.keys(Piece.blocks);

  static getRandomType = () => {
    const index = Math.floor(Math.random() * Piece.types.length);
    return Piece.types[index];
  };

  constructor(type = Piece.getRandomType(), x = 0, y = 0) {
    if (!Piece.types.includes(type)) {
      throw new Error("Invalid piece type");
    }

    this.type = type;
    this.blocks = Piece.blocks[this.type]();
    this.x = x;
    this.y = y;
  }

  // Get the width of the piece based on its blocks
  get width() {
    return this.blocks[0].length;
  }

  // Get the height of the piece based on its blocks
  get height() {
    return this.blocks.length;
  }

  // Rotate the piece clockwise or counterclockwise
  rotate = (clockwise = true) => {
    const blocks = this.blocks;
    const length = blocks.length;
    const mid = Math.floor(length / 2);
    const end = length - 1;

    for (let i = 0; i < mid; i++) {
      for (let j = i; j < end - i; j++) {
        const temp = blocks[i][j];

        if (clockwise) {
          [
            blocks[i][j],
            blocks[end - j][i],
            blocks[end - i][end - j],
            blocks[j][end - i],
          ] = [
            blocks[end - j][i],
            blocks[end - i][end - j],
            blocks[j][end - i],
            temp,
          ];
        } else {
          [
            blocks[i][j],
            blocks[j][end - i],
            blocks[end - i][end - j],
            blocks[end - j][i],
          ] = [
            blocks[j][end - i],
            blocks[end - i][end - j],
            blocks[end - j][i],
            temp,
          ];
        }
      }
    }
  };

  // Create a clone of the piece with the same type, location and rotation
  clone = () => {
    const clone = new Piece(this.type);
    clone.x = this.x;
    clone.y = this.y;

    return clone;
  };

  // Iterate over the blocks of the piece, yielding the active blocks with their absolute positions
  *[Symbol.iterator]() {
    for (let y = 0; y < this.blocks.length; y++) {
      for (let x = 0; x < this.blocks[y].length; x++) {
        if (this.blocks[y][x] === 1) {
          yield {
            x: this.x + x,
            y: this.y + y,
            type: this.type,
          };
        }
      }
    }
  }
}
