import BoxBase from '../../base/boxBase';
import Bottle from '../bottle';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../render';
import { renderBackgroundShadow, renderRoundedRect, setFont } from '../../utils/componentUtil';
import { calculateBottlePositions } from '../../utils/bottleUtil';
import { LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, LARGE_BOX_HEADER_HEIGHT } from '../../constants';

export default class HintBox extends BoxBase {
  constructor() {
    super(LARGE_BOX_WIDTH, LARGE_BOX_HEIGHT, true);
    
    this.setPosition(
      (SCREEN_WIDTH - this.width) / 2,
      (SCREEN_HEIGHT - this.height) / 2
    );
    
    this.solutionBottles = [];
    this.bottleScale = 0.8;
    this.titleHeight = LARGE_BOX_HEADER_HEIGHT;
    this.bottleAreaY = this.y + this.titleHeight;
    this.bottleAreaHeight = this.height - this.titleHeight - 20;
  }

  setSolutionData(solutionIndexes) {
    this.clearSolutionBottles();
    this.createSolutionBottles(solutionIndexes);
  }

  createSolutionBottles(solutionIndexes) {
    const positions = this.calculateScaledBottlePositions(solutionIndexes);
    
    positions.forEach((item, index) => {
      const bottle = this.createBottle(item[0]);
      bottle.init(item[0], item[1], item[2]);
      bottle.width *= this.bottleScale;
      bottle.height *= this.bottleScale;
      this.solutionBottles.push(bottle);
    });
  }

  calculateScaledBottlePositions(bottleIndexes) {
    const originalPositions = calculateBottlePositions(bottleIndexes);
    
    const scaledPositions = originalPositions.map((pos) => {
      const [colorIndex, originalX, originalY] = pos;
      const relativeX = (originalX - 50) * this.bottleScale; // 50是原始的左边距
      const relativeY = (originalY - 200) * this.bottleScale; // 200是原始的上边距
      const finalX = this.x + 50 + relativeX;
      const finalY = this.bottleAreaY + 50 + relativeY;
      return [colorIndex, finalX, finalY];
    });
    
    return scaledPositions;
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
    // TODO: Fix close button
    // TODO: Update postions of bottles
    if (!this.isVisible) return;
    ctx.save();
    
    renderBackgroundShadow(ctx);
    this.drawBoxBackground(ctx, '#f8f8f8', '#cccccc');
    renderRoundedRect(ctx, this.x, this.y, this.width, this.height, 10);
    
    // 绘制标题
    setFont(ctx, 24, '#333333', true);
    ctx.textAlign = 'center';
    ctx.fillText('目标排列', this.x + this.width / 2, this.y + 35);
    
    // 绘制解决方案瓶子
    this.solutionBottles.forEach(bottle => {
      bottle.render(ctx);
    });
    
    // 绘制提示文字
    setFont(ctx, 16, '#666666');
    ctx.textAlign = 'center';
    ctx.fillText('按照上述排列完成游戏', this.x + this.width / 2, this.y + this.height - 30);
    
    // 绘制关闭按钮
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
    
    if (!this.isPointInside(x, y)) {
      this.hide();
      console.log(`OUtside ${GameGlobal.databus.getGameStatus()}`);
      return true;
    }
    console.log(`Inside ${GameGlobal.databus.getGameStatus()}`);
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