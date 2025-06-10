
import { BUTTON_TYPE } from '../constants';

export default class ButtonBase {
  constructor(buttonType, posX, posY, width, height) {
    this.buttonType = buttonType;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  isPointInside(x, y) {
    return x >= this.posX && 
            x <= this.posX + this.width && 
            y >= this.posY && 
            y <= this.posY + this.height;
  }
}