import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Bottle from '../object/bottle';
import { BOTTLE_SPACE, BOTTLE_WIDTH, BOTTLE_HEIGHT, MAX_BOTTLE_PER_ROW, GAME_DESCRIPTION, BUTTON_HEIGHT, BUTTON_SIZE, BUTTON_Y, OP_BUTTON_NAME, GAME_DIFFICULTY, GAME_DIFFICULTY_INFO } from '../constants';
import OpButton, { OPERATION_BUTTONS } from '../object/opButton';
import InfoBox from '../object/infoBox';
import ErrorBox from '../object/errorBox';
import VictoryBox from '../object/victoryBox';
import DifficultySelector from '../object/difficultySelector';

export default class GameInfo {
  bottles = [];
  resetButton = null;
  backButton = null;
  opButtons = new Map();
  bottleClicked = [];

  constructor() {
    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

  setFont() {
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '20px Arial';
  }

  render(ctx) {
    console.log(">>> Render gameinfo");
    this.ctx = ctx;

    this.renderBackground();
    this.renderGameDetails();
    this.renderOpButtons();
    this.renderBottles();
    this.renderVictoryBox();

    this.infoBox = this.infoBox ? this.infoBox : this.infoBox = new InfoBox();
    this.infoBox.render(this.ctx);

    this.errorBox = this.errorBox ? this.errorBox : this.errorBox = new ErrorBox();
    this.errorBox.render(this.ctx);

    this.renderDifficultySelector();
  }

  renderVictoryBox() {
    if (!this.victoryBox) {
      this.victoryBox = new VictoryBox();
    }
    this.victoryBox.setOnRestartCallback(() => {
      this.handleReset();
    });
  
    this.victoryBox.setOnContinueCallback(() => {
      console.log("Continue to next level");
      GameGlobal.databus.initNewGame();
      this.render(this.ctx);
    });
    
    // 如果VictoryBox是可见的，渲染它
    if (this.victoryBox && this.victoryBox.isVisible) {
      this.victoryBox.render(this.ctx);
    }
  }

  renderDifficultySelector() {
    if (!this.difficultySelector) {
      this.difficultySelector = new DifficultySelector();

      this.difficultySelector.setOnDifficultySelect((difficulty) => {
        console.log(`Choose difficulty ${difficulty}`);
        GameGlobal.databus.updateDifficulty(GAME_DIFFICULTY[difficulty.toUpperCase()]);
        this.render(this.ctx);
      });

      this.difficultySelector.setOnClose(() => {
        this.render(this.ctx);
      });
    }
    this.difficultySelector.render(this.ctx);
  }

  renderGameDescription() {
    console.log(`Render Game Description`);
    this.setFont(this.ctx);
    this.ctx.fillText(GAME_DESCRIPTION, 100, 50);
  }

  renderBottles() {
    console.log("renderBottles");
    while (this.bottles.length > 0) {
      this.removeBottle(this.bottles.pop());
    }
    this.placeBottles();
    this.bottles.forEach((bottle) => {
      bottle.render(this.ctx);
    });
  }

  renderBackground() {
    this.ctx.fillStyle = '#f8f8f8';
    this.ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  renderGameDetails() {
    this.setFont(this.ctx);
    this.ctx.textAlign = 'left';

    const difficulty = GAME_DIFFICULTY_INFO.get(GameGlobal.databus.getGameDifficulty()).name;
    this.ctx.fillText(`${difficulty}`, 20, 95);
    this.ctx.fillText(`交换次数: ${GameGlobal.databus.swapCnt}`, 20, 125);
    this.ctx.fillText(`正确个数: ${GameGlobal.databus.correctCnt}`, 20, 155);
  }

  renderOpButtons() {
    var buttonX = SCREEN_WIDTH - 5;
    OPERATION_BUTTONS.forEach((buttonName) => {
      buttonX -= BUTTON_SIZE + 5;
      if (!this.opButtons.get(buttonName)) {
        const newButton = new OpButton(buttonName, buttonX, BUTTON_Y, BUTTON_SIZE);
        newButton.setOnImageLoaded(() => {
          if (this.ctx) {
            this.render(this.ctx);
          }
        });
        this.opButtons.set(buttonName, newButton);
      }
      this.opButtons.get(buttonName).render(this.ctx);
    });
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0]; // 获取触摸点的坐标

    console.log(`Touch event at: ${clientX}, ${clientY}, ${this.difficultySelector}`);

    if (this.difficultySelector && 
          this.difficultySelector.isVisible &&
          this.difficultySelector.handleClick(clientX, clientY)) {
      this.render(this.ctx);
      return;
    }

    if (this.victoryBox && this.victoryBox.handleClick(clientX, clientY)) {
      console.log("CLick victoryBox");
      this.render(this.ctx);
      return;
    }

    if (this.errorBox && this.handleErrorBox(clientX, clientY)) {
      console.log("CLick error");
      this.render(this.ctx);
      return;
    }

    this.handleInfoBox(clientX, clientY);
    this.handleOpButtons(clientX, clientY);
    this.handleBottleSwap(clientX, clientY);
  }

  handleOpButtons(x, y) {
    this.opButtons.forEach((button, buttonName) => {
      if (button.isPointInside(x, y)) {
        if (buttonName == OP_BUTTON_NAME.BACK) {
          console.log("CLick BACK");
          this.handleBack();
        } else if (buttonName == OP_BUTTON_NAME.RESET) {
          console.log("CLick RESET");
          this.handleReset();
        } else if(buttonName == OP_BUTTON_NAME.INFO) {
          console.log("CLick INFO");
          this.handleInfo();
        } else if (buttonName == OP_BUTTON_NAME.MORE) {
          console.log("CLick more");
          this.handleMore();
        }
      }
    });
  }

  handleReset() {
    console.log("Reset is clicked");
    GameGlobal.databus.initNewGame();
    this.render(this.ctx);
  }

  handleBack() {
    console.log("Back is clicked");
    this.bottleClicked = [];
    const backStatus = GameGlobal.databus.backToPrevStep();
    if (!backStatus) {
      console.log("Rende cannot back info");
      const errorX = SCREEN_WIDTH / 2 - this.errorBox.getWidth() / 2;
      const errorY = SCREEN_HEIGHT / 2 - this.errorBox.getHeight() / 2;
      this.errorBox.show('超过后退次数，无法后退！', errorX, errorY);
    }
    this.render(this.ctx);
  }

  handleInfo() {
    const infoButton = this.opButtons.get(OP_BUTTON_NAME.INFO);
    if (infoButton) {
      if (this.infoBox.isVisible) {
        this.infoBox.hide();
      } else {
        this.infoBox.show(infoButton.posX - 70, infoButton.posY, infoButton.width);
      }
      this.render(this.ctx);
    }
  }

  handleMore() {
    console.log("More is clicked");
    if (this.difficultySelector) {
      this.difficultySelector.show(SCREEN_WIDTH, SCREEN_HEIGHT);
      console.log("Difficulty selector shown");
      this.render(this.ctx);
    }
  }

  handleBottleSwap(x, y) {
    this.bottles.forEach((bottle, idx) => {
      if (bottle.isPointInside(x, y)) {
        bottle.renderClick(this.ctx);
        this.bottleClicked.push(idx);
        if (this.bottleClicked.length == 2) {
          const i = this.bottleClicked[0];
          const j = this.bottleClicked[1];
          this.bottleClicked = [];
          GameGlobal.databus.swapBottles(i, j);
          this.render(this.ctx);

          if (GameGlobal.databus.checkVictory()) {
            console.log("Victory");
            this.victoryBox.show(
              GameGlobal.databus.swapCnt,
              GameGlobal.databus.correctCnt,
              SCREEN_WIDTH,
              SCREEN_HEIGHT
            );
            this.render(this.ctx);
          }
        }
      }
    });
  }

  handleInfoBox(x, y) {
    if (this.infoBox.isVisible && !this.infoBox.isPointInside(x, y)) {
      const infoButton = this.opButtons.get(OP_BUTTON_NAME.INFO);
      if (!(infoButton && infoButton.isPointInside(x, y))) {
        this.infoBox.hide();
        this.render(this.ctx);
        return;
      }
    }
  }

  handleErrorBox(x, y) {
    if (this.errorBox.isVisible) {
      this.errorBox.hide();
      return true;
    }
    return false;
  }

  /**
   * Find the positions of all bottles and generate bottles
   */
  placeBottles() {
    const n = GameGlobal.databus.getBottleNumber();
    const rows = Math.ceil(n / MAX_BOTTLE_PER_ROW);
    const lastRowCount = n % MAX_BOTTLE_PER_ROW || MAX_BOTTLE_PER_ROW; // Last row
    const totalHeight = rows * BOTTLE_HEIGHT + (rows - 1) * BOTTLE_SPACE;
    
    const startY = (SCREEN_HEIGHT - totalHeight) / 2;

    GameGlobal.databus.bottleIndexes.forEach((colorIdx, idx) => {
      const row = Math.floor(idx / MAX_BOTTLE_PER_ROW);
      const col = idx % MAX_BOTTLE_PER_ROW;

      const currentRowCount = (row === rows - 1) ? lastRowCount : MAX_BOTTLE_PER_ROW;
      const currentRowWidth = currentRowCount * BOTTLE_WIDTH + (currentRowCount - 1) * BOTTLE_SPACE;
      const currentRowStartX = (SCREEN_WIDTH - currentRowWidth) / 2;
      
      const x = currentRowStartX + col * (BOTTLE_WIDTH + BOTTLE_SPACE);
      const y = startY + row * (BOTTLE_HEIGHT + BOTTLE_SPACE);
      
      const newBottle = this.createBottle(colorIdx);
      newBottle.init(colorIdx, x, y);
      this.bottles.push(newBottle);
    });
  }

  /**
   * Utils
   */
  removeBottle(bottle) {
    const poolId = `Bottle-${bottle.getColorIndex()}`;
    GameGlobal.databus.pool.recover(poolId, bottle);
  }

  createBottle(colorIdx) {
    const poolId = `Bottle-${colorIdx}`;
    const bottle = GameGlobal.databus.pool.getItemByClass(poolId, Bottle);
    return bottle;
  }
}