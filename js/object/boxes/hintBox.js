import BoxBase from '../../base/boxBase';
import Bottle from '../bottle';
import { drawBoxHeader, setFont } from '../../utils/componentUtil';
import { calculateBottlePositions } from '../../utils/bottleUtil';
import { LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, LARGE_BOX_HEADER_HEIGHT, BOTTLE_WIDTH, BOX_TYPE, BOTTLE_SPACING } from '../../constants';

export default class HintBox extends BoxBase {
  constructor() {
    super(BOX_TYPE.LARGE, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);
    
    this.solutionBottles = [];
    this.bottleScale = 0.7;

    // FIXME: Bottles to box edges
    this.bottleLeftPadding = (this.width - 5 * BOTTLE_WIDTH * this.bottleScale - 4 * BOTTLE_SPACING * this.bottleScale) / 2;
    this.bottleTopPadding = LARGE_BOX_HEADER_HEIGHT;
  }

  setSolutionData(solutionIndexes) {
    this.clearSolutionBottles();
    this.createSolutionBottles(solutionIndexes);
  }

  createSolutionBottles(solutionIndexes) {
    const positions = calculateBottlePositions(solutionIndexes, this.bottleScale, this.bottleScale);
    
    positions.forEach((item, index) => {
      const bottle = this.createBottle(item[0]);
      bottle.init(item[0], item[1] + this.bottleLeftPadding, item[2] + this.bottleTopPadding);
      bottle.setBottleSizeWithScale(this.bottleScale);
      this.solutionBottles.push(bottle);
    });
  }

  createBottle(colorIdx) {
    const poolId = `HintBottle-${colorIdx}`;
    let bottle = GameGlobal.databus.pool.getItemByClass(poolId, Bottle);
    if (!bottle) {
      bottle = new Bottle();
    }
    return bottle;
  }

  clearSolutionBottles() {
    this.solutionBottles.forEach(bottle => {
      const poolId = `HintBottle-${bottle.getColorIndex()}`;
      GameGlobal.databus.pool.recover(poolId, bottle);
    });
    this.solutionBottles = [];
  }

  render(ctx) {
    // TODO: Make sure this box simialr to difficultyselector
    // TODO: Update postions of bottles
    if (!this.isVisible) return;
    super.render(ctx);
    ctx.save();

    drawBoxHeader(ctx, '目标排列', this.x, this.y, this.width);
    this.solutionBottles.forEach(bottle => {bottle.render(ctx)});
    
    setFont(ctx, 16, '#666666');
    ctx.textAlign = 'center';
    ctx.fillText('按照上述排列完成游戏', this.x + this.width / 2, this.y + this.height - 30);
    
    this.drawCloseButton(ctx);
    ctx.restore();
  }

  /**
   * Events
   */
  handleClick(x, y) {
    if (!this.isVisible) return false;
    if (this.handleCloseButton && this.handleCloseButton(x, y)) {
      this.hide();
      return true;
    }
    return false;
  }

  show(solutionIndexes) {
    this.setSolutionData(solutionIndexes);
    super.show();
    console.log(`SHOW box ${GameGlobal.databus.getGameStatus()}`);
  }

  hide() {
    super.hide();
    this.clearSolutionBottles();
  }
}