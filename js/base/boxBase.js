import ComponentBase from '../base/componentBase';

export default class BoxBase extends ComponentBase {
  constructor(width, height) {
    super(false, width, height);

    // Close button
    this.hasCloseButton = false;

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
   * Handler
   */
  handleCloseButton(x, y) {
    if (!this.hasCloseButton || !this.isCloseButtonClicked(x, y)) return false;
    console.log("Close button clicked");
    this.hide();
    if (this.onClose) this.onClose();
    return true;
  }

  /**
   * Draw
   */
  drawBoxBackground(ctx, fillColor, strokeColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  drawCloseButton(ctx) {
    this.hasCloseButton = true;
    this.closeButtonX = this.x + this.width - 35;
    this.closeButtonY = this.y + 15;
    this.closeButtonSize = 20;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(this.closeButtonX, this.closeButtonY, this.closeButtonSize, this.closeButtonSize);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('×', this.closeButtonX + this.closeButtonSize / 2, this.closeButtonY + this.closeButtonSize / 2 + 5);
  }

  /**
   * Utils
   */
  isCloseButtonClicked(x, y) {
    if (!this.hasCloseButton) return false;
    console.log("isCloseButtonClicked");
    return x >= this.closeButtonX && 
            x <= this.closeButtonX + this.closeButtonSize &&
            y >= this.closeButtonY && 
            y <= this.closeButtonY + this.closeButtonSize;
  }
} 
