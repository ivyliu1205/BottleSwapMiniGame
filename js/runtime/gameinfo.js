import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Bottle from '../object/bottle';
import { 
  BUTTON_NAME,
  BUTTON_SIZE,
  BUTTON_Y,
  GAME_DESCRIPTION,
  GAME_DIFFICULTY,
  GAME_DIFFICULTY_INFO,
  GAME_STATUS
} from '../constants';
import OpButton, { OPERATION_BUTTONS } from '../object/opButton';
import InfoBox from '../object/infoBox';
import ErrorBox from '../object/errorBox';
import VictoryBox from '../object/victoryBox';
import DifficultySelectorBox from '../object/difficultySelectorBox';
import { isFirstOpenWithVersion } from '../utils/commonUtil';
import { setFont } from '../utils/componentUtil';
import { calculateBottlePositions } from '../utils/bottleUtil';

export default class GameInfo {
  bottles = [];
  resetButton = null;
  backButton = null;
  opButtons = new Map();
  bottleClicked = [];

  constructor() {
    wx.onTouchStart(this.touchEventHandler.bind(this));
  }

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

    this.victoryBox.setOnNewGameCallback(this.handleReset.bind(this));
    this.victoryBox.setOnMoreOptionCallback(this.handleMore.bind(this));;

    this.victoryBox.setOnShareToFriendCallback(() => {
      GameGlobal.databus.shareResultToFriend();
      this.handleReset();
    });
    
    this.victoryBox.setOnShareToMomentsCallback(() => {
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
        GameGlobal.databus.updateDifficulty(GAME_DIFFICULTY[difficulty.toUpperCase()]);
        this.render(this.ctx);
      });
      this.difficultySelectorBox.setOnClose(() => {this.render(this.ctx);});
    }
    this.difficultySelectorBox.render(this.ctx);
  }

  renderGameDescription() {
    setFont(this.ctx, 20);
    this.ctx.fillText(GAME_DESCRIPTION, 100, 50);
  }

  renderBottles() {
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

    switch(GameGlobal.databus.getGameStatus()) {
      case GAME_STATUS.VICTORY:
        if (this.victoryBox && this.victoryBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.ERROR:
        if (this.errorBox && this.errorBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.INFO:
        this.handleInfoBox(clientX, clientY);
        break;
      case GAME_STATUS.PLAYING:
      default:
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
    switch(buttonName) {
      case BUTTON_NAME.BACK:
        this.handleBack();
        break;
        
      case BUTTON_NAME.RESET:
        this.handleReset();
        break;
        
      case BUTTON_NAME.INFO:
        this.handleInfo();
        break;
        
      case BUTTON_NAME.MORE:
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
    GameGlobal.databus.initNewGame();
    this.render(this.ctx);
  }

  handleBack() {
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
    if (this.difficultySelectorBox) {
      this.difficultySelectorBox.show();
      this.render(this.ctx);
    }
  }

  handleBottleSwap(x, y) {
    for (let idx = 0; idx < this.bottles.length; idx++) {
      const bottle = this.bottles[idx];
      if (!bottle.isPointInside(x, y)) continue;
      if (this.bottleClicked.length == 1 && idx == this.bottleClicked[0]) {
        wx.showToast({
          title: '不能交换同一个瓶子，请选择其他瓶子',
          icon: 'none',
          duration: 1000
        });
        continue;
      }

      bottle.renderClick(this.ctx);
      this.bottleClicked.push(idx);
      if (this.bottleClicked.length == 2) {
        GameGlobal.databus.swapBottles(
          this.bottleClicked[0],
          this.bottleClicked[1]
        );
        this.bottleClicked = [];

        if (GameGlobal.databus.checkVictory()) {
          this.changeIntoVictory();
        }
        this.render(this.ctx);
      }
    }
  }

  handleInfoBox(x, y) {
    if (this.infoBox.isPointInside(x, y)) {
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
   * States
   */
  changeIntoVictory() {
    this.victoryBox.show(
      GameGlobal.databus.swapCnt,
      GameGlobal.databus.correctCnt,
      GameGlobal.databus.getGameDifficultyName()
    );
    GameGlobal.databus.setGameStatus(GAME_STATUS.VICTORY);
  }

  /**
   * Utils
   */
  placeBottles() {
    const positions = calculateBottlePositions(GameGlobal.databus.bottleIndexes);
    positions.forEach((item) => {
      const newBottle = this.createBottle(item[0]);
      newBottle.init(item[0], item[1], item[2]);
      this.bottles.push(newBottle);
    });
  }

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
