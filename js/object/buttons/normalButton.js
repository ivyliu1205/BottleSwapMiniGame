import ButtonBase from '../../base/buttonBase';
import { BUTTON_TYPE } from '../../constants';
import { renderRoundedRect, setFont } from '../../utils/componentUtil';

export const NORMAL_BUTTON_TYPE = {
  CONFIRM: 'confirm',
  CANCEL: 'cancel',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};

export const NORMAL_BUTTON_SIZE = {
  WIDTH: 80,
  HEIGHT: 35
};

export default class NormalButton extends ButtonBase {
  constructor(buttonName, normalButtonType, x, y, width = NORMAL_BUTTON_SIZE.WIDTH, height = NORMAL_BUTTON_SIZE.HEIGHT) {
    super(buttonName, BUTTON_TYPE.NORMAL_TEXT_BUTTON, x, y, width, height);
    this.normalButtonType = normalButtonType;
    this.text = buttonName;
    this.isPressed = false;
  }

  /**
   * Render
   */
  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    this.drawButtonBackground(ctx);
    this.drawButtonText(ctx);
    ctx.restore();
  }
  
  /**
   * Handler
   */
  handleClick(x, y) {
    if (!this.isPointInside(x, y)) return false;
    
    // 触发按下效果
    this.isPressed = true;
    
    // 延迟恢复按钮状态，创建按下效果
    setTimeout(() => {
      this.isPressed = false;
    }, 100);
    
    // 执行点击回调
    if (this.onClickCallback) {
      this.onClickCallback(this.buttonName, this.normalButtonType);
    }
    return true;
  }

  /**
   * Draw
   */
  drawButtonBackground(ctx) {
    const { x, y, width, height } = this;
    const backgroundColor = this.getButtonColor();
    this.drawTextButtonBackground(ctx, backgroundColor, backgroundColor);
    renderRoundedRect(ctx, x, y, width, height, 5);

    if (this.isPressed) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(x + 1, y + 1, width - 2, 2);
    }
  }

  drawButtonText(ctx) {
    const { x, y, width, height } = this;
    setFont(ctx, 20, this.getTextColor());
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.fillText(this.text, centerX, centerY);
  }

  /**
   * Getters & Setters
   */
  setText(text) {
    this.text = text;
  }

  getText() {
    return this.text;
  }

   /**
   * Utils
   */
  getTextColor() {
    switch (this.normalButtonType) {
      case NORMAL_BUTTON_TYPE.CONFIRM:
      case NORMAL_BUTTON_TYPE.PRIMARY:
        return '#ffffff';
      case NORMAL_BUTTON_TYPE.CANCEL:
      case NORMAL_BUTTON_TYPE.SECONDARY:
        return '#ffffff';
      default:
        return '#333333';
    }
  }

  getButtonColor() {
    switch (this.normalButtonType) {
      case NORMAL_BUTTON_TYPE.CONFIRM:
      case NORMAL_BUTTON_TYPE.PRIMARY:
        return this.isPressed ? '#0056b3' : '#007bff';
      case NORMAL_BUTTON_TYPE.CANCEL:
      case NORMAL_BUTTON_TYPE.SECONDARY:
        return this.isPressed ? '#5a6268' : '#6c757d';
      default:
        return this.isPressed ? '#e0e0e0' : '#f8f9fa';
    }
  }
}