import OpButton from './opButton';
import { BUTTON_NAME, BUTTON_TYPE } from '../../constants';

const RESET_BUTTON_IMG_SRC = 'images/restart-white.png';
const MORE_BUTTON_IMG_SRC = 'images/more-white.png';
const SHARE_TO_FRIEND_BUTTON_IMG_SRC = 'images/share01.png';
const SHARE_TO_MOMENT_BUTTON_IMG_SRC = 'images/moment.png';

export const INNER_OP_BUTTONS = [ // Right to left
  BUTTON_NAME.SHARE_TO_FRIEND,
  BUTTON_NAME.SHARE_TO_MOMENT,
  BUTTON_NAME.MORE,
  BUTTON_NAME.RESET
];

const INNER_OP_BUTTONS_INFO = new Map([
  [BUTTON_NAME.SHARE_TO_FRIEND, SHARE_TO_FRIEND_BUTTON_IMG_SRC],
  [BUTTON_NAME.SHARE_TO_MOMENT, SHARE_TO_MOMENT_BUTTON_IMG_SRC],
  [BUTTON_NAME.MORE, MORE_BUTTON_IMG_SRC],
  [BUTTON_NAME.RESET, RESET_BUTTON_IMG_SRC]
]);

/**
 * Buttons inside a container
 */
export default class InnerOpButton extends OpButton {

  constructor(buttonName, size, buttonCallbacks = null, x = 0, y = 0) {
    super(buttonName, x, y, size, BUTTON_TYPE.INNER_OP_BUTTON, INNER_OP_BUTTONS_INFO);
    this.buttonCallbacks = buttonCallbacks;
  }

  setButtonCallbacks(buttonCallbacks) {
    this.buttonCallbacks = buttonCallbacks;
  }

  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    if (this.isPointInside(x, y)) {
      if (this.buttonCallbacks && this.buttonCallbacks.has(this.buttonName)) {
        const callback = this.buttonCallbacks.get(this.buttonName);
        if (callback) callback();
      } else if (this.onClickCallback) {
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
