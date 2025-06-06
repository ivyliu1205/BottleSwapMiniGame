import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Bottle from '../object/bottle';
import * as Constants from '../constants';
import ResetButton from '../object/resetButton';
import BackButton from '../object/backButton';

const atlas = wx.createImage();
atlas.src = 'images/Common.png';

export default class GameInfo {
  bottles = [];
  resetButton = null;
  backButton = null;
  bottleClicked = [];

  constructor() {
    wx.onTouchStart(this.touchEventHandler.bind(this))
  }

  setFont() {
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '20px Arial';
  }

  render(ctx) {
    console.log(">>> Render gameinfo");
    this.ctx = ctx;
    // this.renderGameScore(ctx, GameGlobal.databus.score); // 绘制当前分数
    // this.renderGameDescription(ctx);

    // 游戏结束时停止帧循环并显示游戏结束画面
    // if (GameGlobal.databus.isGameOver) {
    //   this.renderGameOver(ctx, GameGlobal.databus.score); // 绘制游戏结束画面
    // }

    // Draw background
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.fillRect(0, 0, Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);

    // Draw scores
    this.renderGameScore();

    // Draw reset button
    this.renderResetButton();

    // Draw back button
    this.renderBackButton();

    // Draw descriptions
    // this.renderGameDescription();

    // Draw bottles
    this.renderBottles();
  }

  renderGameDescription() {
    console.log(`Render Game Description`);
    this.setFont(this.ctx);
    this.ctx.fillText(Constants.GAME_DESCRIPTION, 100, 50);
  }

  renderBottles() {
    this.bottles = [];
    this.placeBottles();
    this.bottles.forEach((bottle) => {
      bottle.render(this.ctx);
    });
  }

  renderGameScore() {
    this.setFont(this.ctx);
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Swap: ${GameGlobal.databus.swapCnt}`, 20, 95);
    this.ctx.fillText(`Correct: ${GameGlobal.databus.correctCnt}`, 20, 125);
  }

  renderResetButton() {
    const buttonX = Constants.SCREEN_WIDTH - Constants.BUTTON_SIZE - 20;
    if (!this.resetButton) {
      this.resetButton = new ResetButton(buttonX, Constants.BUTTON_Y, Constants.BUTTON_SIZE);
      this.resetButton.setOnImageLoaded(() => {
        console.log("Reset button image loaded, re-rendering game");
        this.render(this.ctx);
      });
    }
    
    this.resetButton.render(this.ctx);
  }

  renderBackButton() {
    console.log("Enter renderBackButton");
      const buttonX = Constants.SCREEN_WIDTH - Constants.BUTTON_SIZE * 2 - 30;

      if (!this.backButton) {
        this.backButton = new BackButton(buttonX, Constants.BUTTON_Y, Constants.BUTTON_SIZE);
        this.backButton.setOnImageLoaded(() => {
          console.log("Back button image loaded, re-rendering game");
          this.render(this.ctx);
        });
      }

      this.backButton.render(this.ctx);
  }

  renderGameOver(ctx, score) {
    this.drawGameOverImage(ctx);
    this.drawGameOverText(ctx, score);
    this.drawRestartButton(ctx);
  }

  drawGameOverImage(ctx) {
    ctx.drawImage(
      atlas,
      0,
      0,
      119,
      108,
      SCREEN_WIDTH / 2 - 150,
      SCREEN_HEIGHT / 2 - 100,
      300,
      300
    );
  }

  drawGameOverText(ctx, score) {
    this.setFont(ctx);
    ctx.fillText(
      '游戏结束',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 50
    );
    ctx.fillText(
      `得分: ${score}`,
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 130
    );
  }

  drawRestartButton(ctx) {
    ctx.drawImage(
      atlas,
      120,
      6,
      39,
      24,
      SCREEN_WIDTH / 2 - 60,
      SCREEN_HEIGHT / 2 - 100 + 180,
      120,
      40
    );
    ctx.fillText(
      '重新开始',
      SCREEN_WIDTH / 2 - 40,
      SCREEN_HEIGHT / 2 - 100 + 205
    );
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0]; // 获取触摸点的坐标

    // 当前只有游戏结束时展示了UI，所以只处理游戏结束时的状态
    // if (GameGlobal.databus.isGameOver) {
    //   // 检查触摸是否在按钮区域内
    //   if (
    //     clientX >= this.btnArea.startX &&
    //     clientX <= this.btnArea.endX &&
    //     clientY >= this.btnArea.startY &&
    //     clientY <= this.btnArea.endY
    //   ) {
    //     // 调用重启游戏的回调函数
    //     this.emit('restart');
    //   }
    // }

    // Handle reset button
    this.handleReset(clientX, clientY);

    // Handle back button
    this.handleBack(clientX, clientY);

    // Handle bottle swap
    this.handleBottleSwap(clientX, clientY);
  }

  handleReset(x, y) {
    if (this.resetButton && this.resetButton.isPointInside(x, y)) {
      console.log("Reset is clicked");
      this.handleReset();
      GameGlobal.databus.initNewGame();
      this.render(this.ctx);
    }
  }

  handleBack(x, y) {
    if (this.backButton && this.backButton.isPointInside(x, y)) {
      console.log("Back is clicked");
      this.bottleClicked = [];
      GameGlobal.databus.backToPrevStep();
      this.render(this.ctx);
    }
  }

  handleBottleSwap(x, y) {
    console.log("ENter handleBottleSwap");
    this.bottles.forEach((bottle, idx) => {
      if (this.isPointInBottle(x, y, bottle)) {
        console.log(`Bottle ${idx} is clicked`);
        bottle.renderClick(this.ctx);
        this.bottleClicked.push(idx);
        if (this.bottleClicked.length == 2) {
          const i = this.bottleClicked[0];
          const j = this.bottleClicked[1];
          console.log(`Swap bottles ${i} and ${j}`);
          this.bottleClicked = [];
          GameGlobal.databus.swapBottles(i, j);
          this.render(this.ctx);
        }
      }
    });
  }

  /**
   * Find the positions of all bottles and generate bottles
   */
  placeBottles() {
    const n = GameGlobal.databus.bottleCnt;
    const rows = Math.ceil(n / Constants.MAX_BOTTLE_PER_ROW);
    const lastRowCount = n % Constants.MAX_BOTTLE_PER_ROW || Constants.MAX_BOTTLE_PER_ROW;
    const totalHeight = rows * Constants.BOTTLE_HEIGHT + (rows - 1) * Constants.BOTTLE_SPACE;
    
    const startY = (Constants.SCREEN_HEIGHT - totalHeight) / 2;

    GameGlobal.databus.bottleIndexes.forEach((colorIdx, idx) => {
      const row = Math.floor(idx / Constants.MAX_BOTTLE_PER_ROW);
      const col = idx % Constants.MAX_BOTTLE_PER_ROW;

      const currentRowCount = (row === rows - 1) ? lastRowCount : Constants.MAX_BOTTLE_PER_ROW;
      const currentRowWidth = currentRowCount * Constants.BOTTLE_WIDTH + (currentRowCount - 1) * Constants.BOTTLE_SPACE;
      const currentRowStartX = (Constants.SCREEN_WIDTH - currentRowWidth) / 2;
      
      const x = currentRowStartX + col * (Constants.BOTTLE_WIDTH + Constants.BOTTLE_SPACE);
      const y = startY + row * (Constants.BOTTLE_HEIGHT + Constants.BOTTLE_SPACE);
      
      const newBottle = new Bottle(colorIdx);
      newBottle.init(x, y);
      this.bottles.push(newBottle);
    });
  }

  /**
   * Utils
   */
  isPointInBottle(x, y, bottle) {
    return x >= bottle.x && 
            x <= bottle.x + BOTTLE_WIDTH &&
            y >= bottle.y && 
            y <= bottle.y + BOTTLE_HEIGHT
  }
}
