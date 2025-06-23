import ButtonBase from '../../base/buttonBase';
import { BUTTON_NAME, BUTTON_TYPE } from '../../constants';

const BACK_BUTTON_IMG_SRC = 'images/back.png';
const RESET_BUTTON_IMG_SRC = 'images/reset.png';
const INFO_BUTTON_IMG_SRC = 'images/question.png';
const MORE_BUTTON_IMG_SRC = 'images/more.png';
const HINT_BUTTON_IMG_SRC = 'images/view.png';

export const OPERATION_BUTTONS = [  // Right to left
  BUTTON_NAME.MORE,
  BUTTON_NAME.INFO,
  BUTTON_NAME.RESET,
  BUTTON_NAME.BACK,
  BUTTON_NAME.HINT
]

const OPERATION_BUTTON_INFO = new Map([
  [BUTTON_NAME.MORE, MORE_BUTTON_IMG_SRC],
  [BUTTON_NAME.INFO, INFO_BUTTON_IMG_SRC],
  [BUTTON_NAME.RESET, RESET_BUTTON_IMG_SRC],
  [BUTTON_NAME.BACK, BACK_BUTTON_IMG_SRC],
  [BUTTON_NAME.HINT, HINT_BUTTON_IMG_SRC]
]);

export default class OpButton extends ButtonBase {
  constructor(
    buttonName, x, y, size, 
    buttonType=BUTTON_TYPE.OP_BUTTON,
    buttonInfo=OPERATION_BUTTON_INFO) {
    super(buttonName, buttonType, x, y, size, size);

    this.img = wx.createImage();
    this.img.src = buttonInfo.get(buttonName);

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

  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    if (this.isPointInside(x, y)) {
      if (this.onClickCallback) {
        this.onClickCallback(this.buttonName);
      }
      return true;
    }
    return false;
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
