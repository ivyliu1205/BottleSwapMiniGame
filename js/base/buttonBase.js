
import ComponentBase from './componentBase';

export default class ButtonBase extends ComponentBase {
  constructor(buttonName, buttonType, x, y, width, height) {
    super(true, width, height);
    this.setPosition(x, y);
    this.buttonName = buttonName;
    this.buttonType = buttonType;
    this.onClickCallback = null;
  }

  // handleClick(x, y) {
  //   if (!this.isVisible) return false;
    
  //   if (this.isPointInside(x, y)) {
  //     if (this.buttonCallbacks && this.buttonCallbacks.has(this.buttonName)) {
  //       const callback = this.buttonCallbacks.get(this.buttonName);
  //       if (callback) {
  //         callback();
  //       }
  //     } else if (this.onClickCallback) {
  //       this.onClickCallback(this.buttonName);
  //     }
  //     return true;
  //   }
  //   return false;
  // }
}