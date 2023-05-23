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

  static get types() {
    return Object.keys(this.blocks);
  }

  static getRandomType() {
    const index = Math.floor(Math.random() * this.types.length);
    return this.types[index];
  }

  constructor(type = Piece.getRandomType(), x = 0, y = 0) {
    if (!Piece.types.includes(type)) {
      throw new Error("Invalid peice type");
    }

    this.type = type;
    this.blocks = Piece.blocks[this.type]();
    this.x = x;
    this.y = y;
    this.boxShadow =
      "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"; // Define the box shadow style
  }

  get width() {
    return this.blocks[0].length;
  }

  get height() {
    return this.blocks.length;
  }

  rotate(clockwise = true) {
    const blocks = this.blocks;
    const length = blocks.length;
    const x = Math.floor(length / 2);
    const y = length - 1;

    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        let temp = blocks[i][j];

        if (clockwise) {
          blocks[i][j] = blocks[y - j][i];
          blocks[y - j][i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[j][y - i];
          blocks[j][y - i] = temp;
        } else {
          blocks[i][j] = blocks[j][y - i];
          blocks[j][y - i] = blocks[y - i][y - j];
          blocks[y - i][y - j] = blocks[y - j][i];
          blocks[y - j][i] = temp;
        }
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.blocks.length; y++) {
      for (let x = 0; x < this.blocks[y].length; x++) {
        yield this.blocks[y][x] === 1
          ? {
              x: this.x + x,
              y: this.y + y,
              type: this.type,
            }
          : null;
      }
    }
  }
}
