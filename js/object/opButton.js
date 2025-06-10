import ButtonBase from '../base/buttonBase';
import { OP_BUTTON_NAME, BUTTON_TYPE } from '../constants';

const BACK_BUTTON_IMG_SRC = 'images/back.png';
const RESET_BUTTON_IMG_SRC = 'images/reset.png';
const INFO_BUTTON_IMG_SRC = 'images/question.png';
const MORE_BUTTON_IMG_SRC = 'images/more.png';

export const OPERATION_BUTTONS = [
  OP_BUTTON_NAME.MORE,
  OP_BUTTON_NAME.INFO,
  OP_BUTTON_NAME.RESET,
  OP_BUTTON_NAME.BACK
]

const OPERATION_BUTTON_INFO = new Map([
  [OP_BUTTON_NAME.MORE, MORE_BUTTON_IMG_SRC],
  [OP_BUTTON_NAME.INFO, INFO_BUTTON_IMG_SRC],
  [OP_BUTTON_NAME.RESET, RESET_BUTTON_IMG_SRC],
  [OP_BUTTON_NAME.BACK, BACK_BUTTON_IMG_SRC]
]);

export default class OpButton extends ButtonBase {
  constructor(buttonName, posX, posY, size) {
    super(BUTTON_TYPE.OP_BUTTON, posX, posY, size, size);

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
      ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    } else {
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(this.posX, this.posY, this.width, this.height);
      ctx.strokeStyle = '#999999';
      ctx.strokeRect(this.posX, this.posY, this.width, this.height);
    }
  }
}