
import ComponentBase from './componentBase';

export default class ButtonBase extends ComponentBase {
  constructor(buttonName, buttonType, x, y, width, height) {
    super(true, width, height);
    this.setPosition(x, y);
    this.buttonName = buttonName;
    this.buttonType = buttonType;
    this.onClickCallback = null;
  }
}
