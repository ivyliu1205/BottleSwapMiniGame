import ComponentBase from '../base/componentBase';
import { BOX_TYPE } from '../constants';
import CloseButton from '../object/buttons/closeButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { renderBackgroundShadow, renderRoundedRect } from '../utils/componentUtil';

export default class BoxBase extends ComponentBase {
  constructor(boxType, width, height, showCloseButton = false) {
    super(false, width, height);

    this.boxType = boxType;

    // Position
    this.setPosition(
      (SCREEN_WIDTH - this.width) / 2,
      (SCREEN_HEIGHT - this.height) / 2
    );

    // Close button
    this.showCloseButton = showCloseButton;
    this.closeButton = null;
    
    if (this.showCloseButton) {
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
  render(ctx) {
    switch (this.boxType) {
      case BOX_TYPE.LARGE:
        this.renderLargeBox(ctx);
        break;
      default:
        console.log("No common render methods");
        break;
    }
  }

  renderLargeBox(ctx) {
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#ffffff', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    this.drawCloseButton(ctx);
  }

  drawBoxBackground(ctx, fillColor, strokeColor) {
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
  }

  drawCloseButton(ctx) {
    if (this.closeButton && this.closeButton.isVisible) {
      this.closeButton.render(ctx);
    }
  }

  /**
   * Utils
   */
} 
