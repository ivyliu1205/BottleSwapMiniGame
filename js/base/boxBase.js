import ComponentBase from '../base/componentBase';
import CloseButton from '../object/buttons/closeButton';

export default class BoxBase extends ComponentBase {
  constructor(width, height, showCloseButton = false) {
    super(false, width, height);

    // Close button
    this.showCloseButton = showCloseButton;
    this.closeButton = null;
    
    if (this.showCloseButton) {
      console.log("Draaw showCloseButton");
      this.closeButton = new CloseButton(30);
      this.closeButton.setOnClickCallback(() => {
        this.handleCloseButtonClick();
      });
    }

    // Callback functions
    this.onClose = null;
  }

  /**
   * Callback functions
   */
  setOnClose(callback) {
    this.onClose = callback;
  }

  /**
   * Events
   */
  show() {
    super.show();
    if (this.closeButton) {
      this.closeButton.show();
      this.closeButton.setRelativePosition(this.x, this.y, this.width, this.height);
    }
  }

  hide() {
    super.hide();
    if (this.closeButton) {
      this.closeButton.hide();
    }
  }

  /**
   * Handler
   */
  handleCloseButtonClick() {
    this.hide();
    if (this.onClose) {
      this.onClose();
    }
  }

  handleCloseButton(x, y) {
    if (this.closeButton && this.closeButton.isVisible) {
      return this.closeButton.handleClick(x, y);
    }
    return false;
  }

  /**
   * Setters & Getters
   */
  setPosition(x, y) {
    super.setPosition(x, y);
    if (this.closeButton) {
      this.closeButton.setRelativePosition(this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draw
   */
  drawBoxBackground(ctx, fillColor, strokeColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
  }

  drawCloseButton(ctx) {
    console.log("drawCloseButton");
    if (this.closeButton && this.closeButton.isVisible) {
      console.log("drawCloseButton 2");
      this.closeButton.render(ctx);
    }
  }

  /**
   * Utils
   */
  isCloseButtonClicked(x, y) {
    if (!this.isVisible || !this.hasCloseButton) return false;
    return x >= this.closeButtonX && 
            x <= this.closeButtonX + this.closeButtonSize &&
            y >= this.closeButtonY && 
            y <= this.closeButtonY + this.closeButtonSize;
  }
} 
