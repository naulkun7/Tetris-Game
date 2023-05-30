export default class VirtualKeyboard {
  constructor() {
    this.keyCodes = {
      Enter: 13,
      C: 67,
      U: 85,
      M: 77,
    };

    this.attachEventListeners();
  }

  attachEventListeners() {
    document
      .getElementById("enter-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "Enter"));
    document
      .getElementById("C-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "C"));
    document
      .getElementById("U-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "U"));
    document
      .getElementById("M-button")
      .addEventListener("click", (e) => this.handleButtonClick(e, "M"));
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
