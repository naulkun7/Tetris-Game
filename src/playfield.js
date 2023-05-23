export default class Playfield extends Array {
  constructor(rows, columns) {
    super();

    this.rows = rows;
    this.columns = columns;

    for (let i = 0; i < rows; i++) {
      this[i] = new Array(columns).fill(0);
    }
  }

  hasCollision(piece) {
    for (let block of piece) {
      if (
        block &&
        (this._isOutOfBounds(block.x, block.y) ||
          this._isOccupied(block.x, block.y))
      ) {
        return true;
      }
    }

    return false;
  }

  lockPiece(piece) {
    for (let block of piece) {
      if (block) {
        this[block.y][block.x] = block;
      }
    }
  }

  clearLines() {
    const linesToRemove = this._getLinesToRemove();

    return this._removeLines(linesToRemove);
  }

  reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this[i][j] = 0;
      }
    }
  }

  _getLinesToRemove() {
    let lines = [];

    for (let y = this.rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0;

      for (let x = 0; x < this.columns; x++) {
        if (this[y][x]) {
          numberOfBlocks += 1;
        }
      }

      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < this.columns) {
        continue;
      } else if (numberOfBlocks === this.columns) {
        lines.unshift(y);
      }
    }

    return lines;
  }

  _removeLines(lines) {
    for (let index of lines) {
      this.splice(index, 1);
      this.unshift(new Array(this.columns).fill(0));
    }

    return lines.length;
  }

  _isOutOfBounds(x, y) {
    return this[y] === undefined || this[y][x] === undefined;
  }

  _isOccupied(x, y) {
    return this[y][x];
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        yield this[y][x];
      }
    }
  }
}
