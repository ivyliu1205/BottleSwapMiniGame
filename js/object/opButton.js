import ButtonBase from '../base/buttonBase';
import { BUTTON_NAME, BUTTON_TYPE } from '../constants';

const BACK_BUTTON_IMG_SRC = 'images/back.png';
const RESET_BUTTON_IMG_SRC = 'images/reset.png';
const INFO_BUTTON_IMG_SRC = 'images/question.png';
const MORE_BUTTON_IMG_SRC = 'images/more.png';

export const OPERATION_BUTTONS = [
  BUTTON_NAME.MORE,
  BUTTON_NAME.INFO,
  BUTTON_NAME.RESET,
  BUTTON_NAME.BACK
]

const OPERATION_BUTTON_INFO = new Map([
  [BUTTON_NAME.MORE, MORE_BUTTON_IMG_SRC],
  [BUTTON_NAME.INFO, INFO_BUTTON_IMG_SRC],
  [BUTTON_NAME.RESET, RESET_BUTTON_IMG_SRC],
  [BUTTON_NAME.BACK, BACK_BUTTON_IMG_SRC]
]);

export default class OpButton extends ButtonBase {
  constructor(buttonName, x, y, size) {
    super(BUTTON_TYPE.OP_BUTTON, x, y, size, size);

    this.img = wx.createImage();
    this.img.src = OPERATION_BUTTON_INFO.get(buttonName);

    this.img.onload = () => {
      this.imageLoaded = true;
      this.onImageLoaded && this.onImageLoaded();
    };
    
    this.img.onerror = () => {
      console.error("Failed to load Back button image:", this.img.src);
    };
  }

  setOnImageLoaded(callback) {
    this.onImageLoaded = callback;
  }

  render(ctx) {
    if (this.imageLoaded && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeStyle = '#999999';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}