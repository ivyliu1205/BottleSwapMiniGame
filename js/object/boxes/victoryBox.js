import { renderBackgroundShadow, renderRoundedRect, setFont } from '../../utils/componentUtil';
import BoxBase from '../../base/boxBase';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../render';
import { BUTTON_NAME, INNER_BUTTON_SIZE, INNER_BUTTON_SPACING } from '../../constants';
import InnerOpButton from '../buttons/innerOpButton';

export default class VictoryBox extends BoxBase {
  constructor() {
    super(300, 240);
    this.swapCount = 0;
    this.correctCount = 0;

    // Buttons
    this.inner_buttons = [];
    this.createInnerButtons();

    this.onNewGameCallback = null;
    this.onMoreOptionCallback = null;
    this.onShareToFriendCallback = null;
    this.onShareToMomentsCallback = null;
  }

  show(swapCount, correctCount, difficultyName) {
    this.isVisible = true;
    this.swapCount = swapCount;
    this.correctCount = correctCount;
    this.difficultyName = difficultyName;
    
    this.x = (SCREEN_WIDTH - this.width) / 2;
    this.y = (SCREEN_HEIGHT - this.height) / 2;

    this.updateButtonPositions();
    this.inner_buttons.forEach(button => button.show());
  }

  hide() {
    super.hide();
    this.inner_buttons.forEach(button => button.hide());
  }

  render(ctx) {
    if (!this.isVisible) return;

    ctx.save();
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#061A23', '#061A23');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 12);
    this.drawContents(ctx);
    ctx.restore();
  }

  handleClick(x, y) {
    super.handleClick(x, y);
    for (let button of this.inner_buttons) {
      if (button.handleClick(x, y)) return true;
    }
    return this.isPointInside(x, y) ? true : false;
  }

  /**
   * Draw
   */
  drawContents(ctx) {
    setFont(ctx, 30, '#49B265', true);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const titleX = this.x + this.width / 2;
    const titleY = this.y + 40;
    ctx.fillText('恭喜通关!', titleX, titleY);

    setFont(ctx, 23, '#F3F2F3');
    const lineOneY = this.y + this.height / 2 - 30;
    ctx.fillText(`难度: ${this.difficultyName}`, titleX, lineOneY);
    ctx.fillText(`交换次数: ${this.correctCount}`, titleX, lineOneY + 45);

    this.inner_buttons.forEach(button => button.render(ctx));
  }

  /**
   * Inner Operation Buttons
   */
  createInnerButtons() {
    const buttonCallbacks = new Map([
      [BUTTON_NAME.RESET, () => {
        this.hide();
        this.onNewGameCallback?.();
      }],
      [BUTTON_NAME.MORE, () => {
        this.hide();
        this.onMoreOptionCallback?.();
      }],
      [BUTTON_NAME.SHARE_TO_FRIEND, () => {
        this.hide();
        this.onShareToFriendCallback?.();
      }],
      [BUTTON_NAME.SHARE_TO_MOMENT, () => {
        this.hide();
        this.onShareToMomentsCallback?.();
      }]
    ]);
    
    this.resetButton = new InnerOpButton(BUTTON_NAME.RESET, INNER_BUTTON_SIZE, buttonCallbacks);

    this.moreButton = new InnerOpButton(BUTTON_NAME.MORE, INNER_BUTTON_SIZE, buttonCallbacks);

    this.shareToFriendButton = new InnerOpButton(BUTTON_NAME.SHARE_TO_FRIEND, INNER_BUTTON_SIZE, buttonCallbacks);

    this.shareToMomentsButton = new InnerOpButton(BUTTON_NAME.SHARE_TO_MOMENT, INNER_BUTTON_SIZE, buttonCallbacks);

    this.inner_buttons = [this.resetButton, this.moreButton, this.shareToFriendButton, this.shareToMomentsButton];
  }

  setOnNewGameCallback(callback) {
    this.onNewGameCallback = callback;
  }

  setOnMoreOptionCallback(callback) {
    this.onMoreOptionCallback = callback;
  }

  setOnShareToFriendCallback(callback) {
    this.onShareToFriendCallback = callback;
  }

  setOnShareToMomentsCallback(callback) {
    this.onShareToMomentsCallback = callback;
  }

  updateButtonPositions() {
    const buttonsAreaY = this.y + this.height - 60;
    const totalButtonsWidth = INNER_BUTTON_SIZE * 4 + INNER_BUTTON_SPACING * 3;
    const startX = this.x + (this.width - totalButtonsWidth) / 2;
    
    this.resetButton.setPosition(startX, buttonsAreaY);
    this.moreButton.setPosition(startX + INNER_BUTTON_SIZE + INNER_BUTTON_SPACING, buttonsAreaY);
    this.shareToFriendButton.setPosition(startX + (INNER_BUTTON_SIZE + INNER_BUTTON_SPACING) * 2, buttonsAreaY);
    this.shareToMomentsButton.setPosition(startX + (INNER_BUTTON_SIZE + INNER_BUTTON_SPACING) * 3, buttonsAreaY);
  }
}
