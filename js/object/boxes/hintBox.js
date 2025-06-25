import BoxBase from '../../base/boxBase';
import Bottle from '../bottle';
import { drawBoxHeader, setFont } from '../../utils/componentUtil';
import { calculateBottlePositions } from '../../utils/bottleUtil';
import { LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, LARGE_BOX_HEADER_HEIGHT, BOX_TYPE } from '../../constants';

export default class HintBox extends BoxBase {
  constructor() {
    super(BOX_TYPE.LARGE, LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);
    
    this.solutionBottles = [];
    this.bottleScale = 0.7;
  }

  setSolutionData(solutionIndexes) {
    this.clearSolutionBottles();
    this.createSolutionBottles(solutionIndexes);
  }

  createSolutionBottles(solutionIndexes) {
    const containerArea = {
      width: this.width,
      height: this.height - LARGE_BOX_HEADER_HEIGHT - 60,
      x: this.x,
      y: this.y + LARGE_BOX_HEADER_HEIGHT
    };
    
    const positions = calculateBottlePositions(
      solutionIndexes, 
      this.bottleScale, 
      containerArea
    );
    
    positions.forEach((item, index) => {
      const bottle = this.createBottle(item[0]);
      bottle.init(item[0], item[1], item[2]);
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
    if (!this.isVisible) return;
    super.render(ctx);
    ctx.save();

    drawBoxHeader(ctx, '目标排列', this.x, this.y, this.width);
    this.solutionBottles.forEach(bottle => {
      bottle.render(ctx);
    });
    
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
  }

  hide() {
    super.hide();
    this.clearSolutionBottles();
  }
}
