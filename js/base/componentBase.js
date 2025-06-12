
export default class ComponentBase {
  constructor(isVisible, width, height) {
    this.isVisible = isVisible;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;

    this.onClickCallback = null;
    this.onHideCallback = null;
    this.onShowCallback = null;
  }

  /**
   * Callbacks
   */
  setonClickCallback(callback) {
    this.onClickCallback = callback;
  }

  setOnHideCallback(callback) {
    this.onHideCallback = callback;
  }

  setOnShowCallback(callback) {
    this.onShowCallback = callback;
  }

  /**
   * Events
   */
  isPointInside(x, y) {
    return this.isVisible && 
           x >= this.x && 
           x <= this.x + this.width && 
           y >= this.y && 
           y <= this.y + this.height;
  }

  hide() {
    this.isVisible = false;
    if (this.onHideCallback) {
      this.onHideCallback();
    }
  }

  show() {
    this.isVisible = true;
    if (this.onShowCallback) {
      this.onHideCallback();
    }
  }

  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
  }

  /**
   * Getters & Setters
   */
  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}