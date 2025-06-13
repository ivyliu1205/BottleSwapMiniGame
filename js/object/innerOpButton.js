import OpButton from '../object/opButton';
import { BUTTON_NAME, BUTTON_TYPE } from '../constants';

const RESET_BUTTON_IMG_SRC = 'images/reset.png';
const SHARE_TO_FRIEND_BUTTON_IMG_SRC = 'images/share.png';
const SHARE_TO_MOMENT_BUTTON_IMG_SRC = 'images/moment.png';

export const INNER_OP_BUTTONS = [ // Right to left
  BUTTON_NAME.SHARE_TO_FRIEND,
  BUTTON_NAME.SHARE_TO_MOMENT,
  BUTTON_NAME.RESET
];

const INNER_OP_BUTTONS_INFO = new Map([
  [BUTTON_NAME.SHARE_TO_FRIEND, SHARE_TO_FRIEND_BUTTON_IMG_SRC],
  [BUTTON_NAME.SHARE_TO_MOMENT, SHARE_TO_MOMENT_BUTTON_IMG_SRC],
  [BUTTON_NAME.RESET, RESET_BUTTON_IMG_SRC]
]);

/**
 * Buttons inside a container
 */
export default class InnerOpButton extends OpButton {

  constructor(buttonName, x, y, size) {
    super(buttonName, x, y, size, BUTTON_TYPE.INNER_OP_BUTTON, INNER_OP_BUTTONS_INFO);
  }

  handleClick(x, y) {
    if (!this.isVisible) return false;
    
    // if (this.isPointInside(x, y)) {
    //   if (this.onClickCallback) {
    //     this.onClickCallback(this.buttonName);
    //   }
    //   return true;
    // }
    // return false;
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

  setRelativePosition(parentX, parentY, parentWidth, parentHeight) {
    // FIXME
    this.x = parentX + parentWidth - this.width - 10;
    this.y = parentY + 10;
  }
}