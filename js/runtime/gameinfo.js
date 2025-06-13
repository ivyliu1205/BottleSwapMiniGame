import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Bottle from '../object/bottle';
import { BOTTLE_SPACE, BOTTLE_WIDTH, BOTTLE_HEIGHT, MAX_BOTTLE_PER_ROW, GAME_DESCRIPTION, BUTTON_HEIGHT, BUTTON_SIZE, BUTTON_Y, BUTTON_NAME, GAME_DIFFICULTY, GAME_DIFFICULTY_INFO, GAME_STATUS } from '../constants';
import OpButton, { OPERATION_BUTTONS } from '../object/opButton';
import InfoBox from '../object/infoBox';
import ErrorBox from '../object/errorBox';
import VictoryBox from '../object/victoryBox';
import DifficultySelectorBox from '../object/difficultySelectorBox';
import { isFirstOpenWithVersion } from '../utils';
import { setFont } from '../utils/componentUtil';

export default class GameInfo {
  bottles = [];
  resetButton = null;
  backButton = null;
  opButtons = new Map();
  bottleClicked = [];

  constructor() {
    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

  // setFont() {
  //   this.ctx.fillStyle = '#000000';
  //   this.ctx.font = '20px Arial';
  // }

  render(ctx) {
    this.ctx = ctx;

    this.renderBackground();
    this.renderGameDetails();
    this.renderOpButtons();
    this.renderBottles();
    this.renderVictoryBox();
    this.renderInfoBox();
    this.renderErrorBox();
    this.renderDifficultySelectorBox();

    if (isFirstOpenWithVersion()) {
      console.log("Is first open");
      this.handleInfo();
    }
  }

  renderVictoryBox() {
    if (!this.victoryBox) {
      this.victoryBox = new VictoryBox();
    }
    this.victoryBox.setOnHideCallback(() => {
      GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
    });

    this.victoryBox.setOnNewGameCallback(() => {
      this.handleReset();
    });

    this.victoryBox.setOnShareToFriendCallback(() => {
      console.log("Share to friend");
      GameGlobal.databus.shareResultToFriend();
      this.handleReset();
    });
    
    this.victoryBox.setOnShareToMomentsCallback(() => {
      console.log("Share to cycle");
      GameGlobal.databus.shareResultToMoment();
      this.handleReset();
    });
    
    if (this.victoryBox && this.victoryBox.isVisible) {
      this.victoryBox.render(this.ctx);
    }
  }

  renderInfoBox() {
    this.infoBox = this.infoBox ? this.infoBox : this.infoBox = new InfoBox();
    this.infoBox.render(this.ctx);
  }

  renderErrorBox() {
    this.errorBox = this.errorBox ? this.errorBox : this.errorBox = new ErrorBox();
    this.errorBox.setOnHideCallback(() => {
      GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
    });
    this.errorBox.render(this.ctx);
  }

  renderDifficultySelectorBox() {
    if (!this.difficultySelectorBox) {
      this.difficultySelectorBox = new DifficultySelectorBox();

      this.difficultySelectorBox.setOnDifficultySelect((difficulty) => {
        console.log(`Choose difficulty ${difficulty}`);
        GameGlobal.databus.updateDifficulty(GAME_DIFFICULTY[difficulty.toUpperCase()]);
        this.render(this.ctx);
      });

      this.difficultySelectorBox.setOnClose(() => {
        this.render(this.ctx);
      });
    }
    this.difficultySelectorBox.render(this.ctx);
  }

  renderGameDescription() {
    console.log(`Render Game Description`);
    // this.setFont(this.ctx);
    setFont(this.ctx, 20);
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
    this.ctx.textAlign = 'left';

    const difficulty = GAME_DIFFICULTY_INFO.get(GameGlobal.databus.getGameDifficulty()).name;
    setFont(this.ctx, 25, undefined, true);
    this.ctx.fillText(`${difficulty}`, 20, 90);

    setFont(this.ctx, 20);
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
            this.render(this.ctx);
        });
        newButton.setOnClickCallback((clickedButtonName) => {
          this.handleButtonClick(clickedButtonName);
        });
        this.opButtons.set(buttonName, newButton);
      }
      this.opButtons.get(buttonName).render(this.ctx);
    });
  }

  touchEventHandler(event) {
    const { clientX, clientY } = event.touches[0];
    console.log(`Touch event at: ${clientX}, ${clientY}, ${this.difficultySelectorBox}`);

    switch(GameGlobal.databus.getGameStatus()) {
      case GAME_STATUS.VICTORY:
        console.log("PLaying VICTORY");
        if (this.victoryBox && this.victoryBox.handleClick(clientX, clientY)) {
          console.log("CLick victoryBox");
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.ERROR:
        console.log("PLaying ERROR");
        if (this.errorBox && this.errorBox.handleClick(clientX, clientY)) {
          console.log("CLick error");
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.INFO:
        console.log("PLaying INFO");
        this.handleInfoBox(clientX, clientY);
        break;
      case GAME_STATUS.PLAYING:
      default:
        console.log("PLaying status");
        if (this.difficultySelectorBox && 
              this.difficultySelectorBox.handleClick(clientX, clientY)) {
            this.render(this.ctx);
            return;
        }
        this.handleOpButtons(clientX, clientY);
        this.handleBottleSwap(clientX, clientY);
        break;
    }
  }

  handleButtonClick(buttonName) {
    console.log(`Button clicked: ${buttonName}`);
    
    switch(buttonName) {
      case BUTTON_NAME.BACK:
        console.log("Click BACK");
        this.handleBack();
        break;
        
      case BUTTON_NAME.RESET:
        console.log("Click RESET");
        this.handleReset();
        break;
        
      case BUTTON_NAME.INFO:
        console.log("Click INFO");
        this.handleInfo();
        break;
        
      case BUTTON_NAME.MORE:
        console.log("Click MORE");
        this.handleMore();
        break;
        
      default:
        console.warn(`Unknown button: ${buttonName}`);
    }
  }

  handleOpButtons(x, y) {
    this.opButtons.forEach((button) => {
      if (button.handleClick(x, y)) {
        return true;
      }
    });
    return false;
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
      this.errorBox.show('超过后退次数，无法后退！');
      GameGlobal.databus.setGameStatus(GAME_STATUS.ERROR);
    }
    this.render(this.ctx);
  }

  handleInfo() {
    const infoButton = this.opButtons.get(BUTTON_NAME.INFO);
    if (infoButton) {
      if (this.infoBox.isVisible) {
        this.infoBox.hide();
        GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
      } else {
        this.infoBox.show();
        GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
      }
      this.render(this.ctx);
    }
  }

  handleMore() {
    console.log("More is clicked");
    if (this.difficultySelectorBox) {
      this.difficultySelectorBox.show();
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
          GameGlobal.databus.swapBottles(
            this.bottleClicked[0],
            this.bottleClicked[1]
          );
          this.bottleClicked = [];
          // this.render(this.ctx);

          if (GameGlobal.databus.checkVictory()) {
            this.victoryBox.show(
              GameGlobal.databus.swapCnt,
              GameGlobal.databus.correctCnt,
              GameGlobal.databus.getGameDifficultyName()
            );
            GameGlobal.databus.setGameStatus(GAME_STATUS.VICTORY);
          }
          this.render(this.ctx);
        }
      }
    });
  }

  handleInfoBox(x, y) {
    if (this.infoBox.isPointInside(x, y)) {
      console.log("handleInfoBox");
      if (this.infoBox.handleClick(x, y)) {
        this.render(this.ctx);
      }
      return;
    }
    const infoButton = this.opButtons.get(BUTTON_NAME.INFO);
    if (infoButton && infoButton.isPointInside(x, y)) {
      this.handleInfo();
      return;
    }
    
    this.infoBox.hide();
    GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
    this.render(this.ctx);
  }

  /**
   * Find the positions of all bottles and generate bottles
   */
  placeBottles() {
    const n = GameGlobal.databus.getBottleNumber();
    
    // 如果瓶子数量小于等于5，直接放在一排
    if (n <= 5) {
        const totalWidth = n * BOTTLE_WIDTH + (n - 1) * BOTTLE_SPACE;
        const startX = (SCREEN_WIDTH - totalWidth) / 2;
        const y = SCREEN_HEIGHT / 2 - BOTTLE_HEIGHT / 2;
        
        GameGlobal.databus.bottleIndexes.forEach((colorIdx, idx) => {
            const x = startX + idx * (BOTTLE_WIDTH + BOTTLE_SPACE);
            
            const newBottle = this.createBottle(colorIdx);
            newBottle.init(colorIdx, x, y);
            this.bottles.push(newBottle);
        });
        return;
    }
    
    // 大于5个瓶子时，尽量均分每行
    const rows = Math.ceil(n / MAX_BOTTLE_PER_ROW);
    const bottlesPerRow = Math.floor(n / rows); // 基础每行瓶子数
    const extraBottles = n % rows; // 需要多分配的瓶子数
    
    // 计算每行的瓶子数量
    const rowCounts = [];
    for (let i = 0; i < rows; i++) {
        // 前面的行多分配一个瓶子（如果有余数的话）
        rowCounts[i] = bottlesPerRow + (i < extraBottles ? 1 : 0);
    }
    
    const totalHeight = rows * BOTTLE_HEIGHT + (rows - 1) * BOTTLE_SPACE;
    const startY = (SCREEN_HEIGHT - totalHeight) / 2;
    
    let bottleIndex = 0;
    
    var colorIndexes = [];
    for (let row = 0; row < rows; row++) {
        const currentRowCount = rowCounts[row];
        const currentRowWidth = currentRowCount * BOTTLE_WIDTH + (currentRowCount - 1) * BOTTLE_SPACE;
        const currentRowStartX = (SCREEN_WIDTH - currentRowWidth) / 2;
        
        for (let col = 0; col < currentRowCount; col++) {
            const x = currentRowStartX + col * (BOTTLE_WIDTH + BOTTLE_SPACE);
            const y = startY + row * (BOTTLE_HEIGHT + BOTTLE_SPACE);
            
            const colorIdx = GameGlobal.databus.bottleIndexes[bottleIndex];
            colorIndexes.push([colorIdx, x, y]);
            bottleIndex++;
        }
    }

    colorIndexes.forEach((item) => {
      const newBottle = this.createBottle(item[0]);
      newBottle.init(item[0], item[1], item[2]);
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