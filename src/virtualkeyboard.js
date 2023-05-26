export default class VirtualKeyboard {
  constructor() {
    this.keyCodes = {
      ArrowLeft: 37,
      ArrowUp: 38,
      ArrowRight: 39,
      ArrowDown: 40,
      Enter: 13,
      Space: 32,
      E: 69,
    };

    this.attachEventListeners();
  }

  attachEventListeners() {
    document
      .getElementById("left-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "ArrowLeft"));
    document
      .getElementById("right-button")
      .addEventListener("click", (e) =>
        this.handleButtonClick(e, "ArrowRight")
      );
    document
      .getElementById("up-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "ArrowUp"));
    document
      .getElementById("down-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "ArrowDown"));
    document
      .getElementById("enter-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "Enter"));
    document
      .getElementById("E-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "E"));
    document
      .getElementById("space-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "Space"));
  }

  handleButtonClick(e, key) {
    e.preventDefault();
    console.log(`${key} button clicked`);
    this.simulateArrowKeyPress(key);
  }

  simulateArrowKeyPress(key) {
    const keyCode = this.keyCodes[key];
    if (!keyCode) {
      return; // Ignore keys other than arrow keys
    }

    const delay = 100; // Delay in milliseconds between key presses

    setTimeout(() => {
      const keyDownEvent = new KeyboardEvent("keydown", {
        keyCode: keyCode,
        key: key,
      });
      const keyPressEvent = new KeyboardEvent("keypress", {
        keyCode: keyCode,
        key: key,
      });
      const keyUpEvent = new KeyboardEvent("keyup", {
        keyCode: keyCode,
        key: key,
      });

      document.dispatchEvent(keyDownEvent);
      document.dispatchEvent(keyPressEvent);
      document.dispatchEvent(keyUpEvent);
    }, delay);
  }
}
