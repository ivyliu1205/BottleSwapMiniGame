
import { BUTTON_TYPE } from '../constants';
import ComponentBase from './componentBase';

export default class ButtonBase extends ComponentBase {
  constructor(buttonType, x, y, width, height) {
    super(true, width, height);
    this.setPosition(x, y);
    this.buttonType = buttonType;
  }
}