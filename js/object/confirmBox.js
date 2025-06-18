import BoxBase from '../base/boxBase';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { setFont, renderBackgroundShadow, renderRoundedRect } from '../utils/componentUtil';
import NormalButton, { NORMAL_BUTTON_TYPE, NORMAL_BUTTON_SIZE } from '../object/buttons/normalButton';

const CONFIRM_BOX_WIDTH = 300;
const CONFIRM_BOX_HEIGHT = 200;

export default class ConfirmBox extends BoxBase {
  constructor() {
    super(CONFIRM_BOX_WIDTH, CONFIRM_BOX_HEIGHT, false);
    
    this.setPosition(
      (SCREEN_WIDTH - CONFIRM_BOX_WIDTH) / 2,
      (SCREEN_HEIGHT - CONFIRM_BOX_HEIGHT) / 2
    );
    
    // Buttons
    this.createButtons();
    this.onConfirmCallback = null;
    this.onCancelCallback = null;
  }

  /**
   * Render
   */
  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#ffffff', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    
    setFont(ctx, 24, '#333333', true);
    ctx.textAlign = 'center';
    ctx.fillText(this.title, this.x + this.width / 2, this.y + 50);
    
    setFont(ctx, 18, '#666666');
    ctx.fillText(this.content, this.x + this.width / 2, this.y + 90);

    this.confirmButton.render(ctx);
    this.cancelButton.render(ctx);
    ctx.restore();
  }

  /**
   * Events
   */
  show(title, content) {
    console.log("ENter confirm box show");
    super.show();
    this.title = title;
    this.content = content;
  }

  /**
   * Draw
   */


  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    if (this.confirmButton.handleClick(x, y)) {
      return true;
    }
    
    if (this.cancelButton.handleClick(x, y)) {
      return true;
    }
    
    if (this.isPointInside(x, y)) {
      return true;
    }
    return false;
  }

  /**
   * Buttons
   */
  createButtons() {
    console.log("Creaye confirm buttons");
    const buttonY = this.y + CONFIRM_BOX_HEIGHT - NORMAL_BUTTON_SIZE.HEIGHT - 20;
    const buttonSpacing = 20;
    const totalButtonWidth = NORMAL_BUTTON_SIZE.WIDTH * 2 + buttonSpacing;
    const buttonStartX = this.x + (CONFIRM_BOX_WIDTH - totalButtonWidth) / 2;
    
    // Confirm Button
    this.confirmButton = new NormalButton(
      '是', 
      NORMAL_BUTTON_TYPE.CONFIRM,
      buttonStartX,
      buttonY
    );
    
    // Cancel Button
    this.cancelButton = new NormalButton(
      '否',
      NORMAL_BUTTON_TYPE.CANCEL,
      buttonStartX + NORMAL_BUTTON_SIZE.WIDTH + buttonSpacing,
      buttonY
    );
    
    this.confirmButton.setOnClickCallback(() => {
      if (this.onConfirmCallback) {
        this.onConfirmCallback();
      }
      this.hide();
    });
    
    this.cancelButton.setOnClickCallback(() => {
      if (this.onCancelCallback) {
        this.onCancelCallback();
      }
      this.hide();
    });
  }

  setOnConfirm(callback) {
    this.onConfirmCallback = callback;
  }

  setOnCancel(callback) {
    this.onCancelCallback = callback;
  }

  /**
   * Util
   */

}
