
import { BUTTON_TYPE } from '../constants';
import ComponentBase from './componentBase';

export default class ButtonBase extends ComponentBase {
  constructor(buttonName, buttonType, x, y, width, height) {
    super(true, width, height);
    this.setPosition(x, y);
    this.buttonName = buttonName;
    this.buttonType = buttonType;
    this.onClickCallback = null;
  }

  /**
   * Drawing
   */
  drawTextButtonBackground(ctx, fillColor, strokeColor) {
    if (this.buttonType != BUTTON_TYPE.NORMAL_TEXT_BUTTON) return;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
  }
}
