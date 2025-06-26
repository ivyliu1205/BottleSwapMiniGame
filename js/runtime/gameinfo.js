import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import Bottle from '../object/bottle';
import { 
  ANIMATION_MODE,
  BUTTON_NAME,
  BUTTON_SIZE,
  BUTTON_Y,
  GAME_DESCRIPTION,
  GAME_DIFFICULTY,
  GAME_DIFFICULTY_INFO,
  GAME_STATUS
} from '../constants';
import OpButton, { OPERATION_BUTTONS } from '../object/buttons/opButton';
import InfoBox from '../object/boxes/infoBox';
import VictoryBox from '../object/boxes/victoryBox';
import DifficultySelectorBox from '../object/boxes/difficultySelectorBox';
import { isFirstOpenWithVersion } from '../utils/commonUtil';
import { setFont } from '../utils/componentUtil';
import { calculateBottlePositions } from '../utils/bottleUtil';
import BottleAnimationManager from './bottleAnimationManager';
import ConfirmBox, { CONFIRM_BOM_TYPE } from '../object/boxes/confirmBox';
import HintBox from '../object/boxes/hintBox';
import { sendFeedback } from '../utils/wxUtils';
import ScoreAnimationManager from './scoreAnimationManager';

export default class GameInfo {
  bottles = [];
  resetButton = null;
  backButton = null;
  opButtons = new Map();
  bottleClicked = [];

  constructor() {
    wx.onTouchStart(this.touchEventHandler.bind(this));

    this.bottleAnimationManager = new BottleAnimationManager();
    this.setupBottleAnimationCallbacks();

    this.scoreAnimationManager = new ScoreAnimationManager();
    this.setupScoreAnimationCallbacks();
  }

  render(ctx) {
    this.ctx = ctx;
    this.renderBackground();
    this.renderGameDetails();
    this.renderOpButtons();
    this.renderBottles();
    this.renderVictoryBox();
    this.renderInfoBox();
    this.renderConfirmBox();
    this.renderHintBox();
    this.renderDifficultySelectorBox();
    if (isFirstOpenWithVersion()) {
      this.handleInfo();
    }
  }

  renderVictoryBox() {
    if (!this.victoryBox) {
      this.victoryBox = new VictoryBox();
      this.victoryBox.setOnNewGameCallback(this.handleReset.bind(this));
      this.victoryBox.setOnMoreOptionCallback(this.handleMore.bind(this));
      this.victoryBox.setOnShareToFriendCallback(() => {
        GameGlobal.databus.shareResultToFriend();
        this.changeIntoVictory();
      });
      
      this.victoryBox.setOnShareToMomentsCallback(() => {
        GameGlobal.databus.shareResultToMoment();
        this.changeIntoVictory();
      });
    }
    
    if (this.victoryBox && this.victoryBox.isVisible) {
      this.victoryBox.render(this.ctx);
    }
  }

  renderInfoBox() {
    if (!this.infoBox) {
      this.infoBox = new InfoBox();
      this.infoBox.setOnShowCallback(() => {
        GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
      });
      this.infoBox.setOnHideCallback(() => {
        GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
      });
      this.infoBox.setOnFeedbackClick((buttonName) => {
        this.handleButtonClick(buttonName);
      });
      this.infoBox.setOnImageLoaded(() => {
        this.render(this.ctx);
      });
    }
    if (this.infoBox.isVisible) {
      this.infoBox.render(this.ctx);
    }
  }

  renderConfirmBox() {
    if (!this.confirmBox) {
      this.confirmBox = new ConfirmBox();
  
      this.confirmBox.setOnShowCallback(() => {
        GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
      });
  
      this.confirmBoxType = null;
      this.confirmBox.setOnConfirm(() => {
        if (this.confirmBoxType === CONFIRM_BOM_TYPE.HINT) {
          this.hintBox.show(GameGlobal.databus.getExpectedBottleIndexes());
        } else if (this.confirmBoxType === CONFIRM_BOM_TYPE.BACK) {
          GameGlobal.databus.backToPrevStep();
          GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
        }
        this.confirmBoxType = null;
      });
  
      this.confirmBox.setOnCancel(() => {
        GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
        this.confirmBoxType = null;
      });
    }
  
    if (this.confirmBox.isVisible) {
      this.confirmBox.render(this.ctx);
    }
  }

  renderHintBox() {
    if (!this.hintBox) {
      this.hintBox = new HintBox();

      this.hintBox.setOnShowCallback(() => {
        GameGlobal.databus.incrementSwapCnt(10);
        GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
      });
      
      this.hintBox.setOnHideCallback(() => {
        GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
      });
    }
    
    if (this.hintBox && this.hintBox.isVisible) {
      this.hintBox.render(this.ctx);
    }
  }

  renderDifficultySelectorBox() {
    if (!this.difficultySelectorBox) {
      this.difficultySelectorBox = new DifficultySelectorBox();

      this.difficultySelectorBox.setOnDifficultySelect((difficulty) => {
        GameGlobal.databus.updateDifficulty(GAME_DIFFICULTY[difficulty.toUpperCase()]);
        GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
      });

      this.difficultySelectorBox.setOnClose(() => {
        if (GameGlobal.databus.getGameStatus() == GAME_STATUS.VICTORY) {
          this.changeIntoVictory();
        } 
      });
    }
    this.difficultySelectorBox.render(this.ctx);
  }

  renderGameDescription() {
    setFont(this.ctx, 20);
    this.ctx.fillText(GAME_DESCRIPTION, 100, 50);
  }

  renderBottles() {
    if (!this.bottleAnimationManager.getIsAnimating()) {
      while (this.bottles.length > 0) {
        this.removeBottle(this.bottles.pop());
      }
      this.placeBottles();
    }
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
    this.drawCorrectCount();
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
    const gameStatus = GameGlobal.databus.getGameStatus();
    // console.log('Touch event:', clientX, clientY, 'Game status:', gameStatus);
  
    switch(gameStatus) {
      case GAME_STATUS.VICTORY:
        if (this.victoryBox && 
          this.victoryBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        if (this.difficultySelectorBox && 
          this.difficultySelectorBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.INFO:
        if (this.infoBox && this.infoBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        if (this.confirmBox && this.confirmBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        if (this.hintBox && this.hintBox.handleClick(clientX, clientY)) {
          this.render(this.ctx);
          return;
        }
        break;
      case GAME_STATUS.PLAYING:
      default:
        if (this.difficultySelectorBox && 
              this.difficultySelectorBox.handleClick(clientX, clientY)) {
            this.render(this.ctx);
            return;
        }
        if (this.handleOpButtons(clientX, clientY)) {
          return;
        }
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

      case BUTTON_NAME.HINT:
        this.handleHint();
        break;
      
      case BUTTON_NAME.FEEDBACK:
        sendFeedback();
        break;
        
      default:
        console.warn(`Unknown button: ${buttonName}`);
    }
    this.render(this.ctx);
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
    GameGlobal.databus.setGameStatus(GAME_STATUS.PLAYING);
    this.bottleAnimationManager.cancelAnimation();
    this.bottleClicked = [];
    this.scoreAnimationManager.stopAnimation();
    GameGlobal.databus.initNewGame();
    this.scoreAnimationManager.initialize(GameGlobal.databus.correctCnt);
  }

  handleBack() {
    this.handleBottleAnimationInProgress();
    this.bottleClicked = [];
    
    const errorMsg = GameGlobal.databus.getBackErrorMsg();
    if (errorMsg) {
      wx.showToast({
        title: errorMsg,
        icon: 'error',
        duration: 2000
      });
      return;
    }
    this.confirmBoxType = CONFIRM_BOM_TYPE.BACK;
    this.confirmBox.show('确认后退', ['是否要撤销上一次的交换操作？', '撤销会导致交换次数+1']);
    GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
  }

  handleInfo() {
    const infoButton = this.opButtons.get(BUTTON_NAME.INFO);
    if (infoButton) {
      if (this.infoBox.isVisible) {
        this.infoBox.hide();
      } else {
        this.infoBox.show();
      }
    }
  }

  handleMore() {
    if (this.difficultySelectorBox) {
      this.difficultySelectorBox.show();
    }
  }

  handleHint() {
    this.confirmBoxType = CONFIRM_BOM_TYPE.HINT;
    this.confirmBox.show('使用提示', ['是否要查看答案？', '查看会导致交换次数+10']);
    GameGlobal.databus.setGameStatus(GAME_STATUS.INFO);
  }

  handleBottleSwap(x, y) {
    this.handleBottleAnimationInProgress();
    var isBottleClicked = false;

    for (let idx = 0; idx < this.bottles.length; idx++) {
      const bottle = this.bottles[idx];
      if (!bottle.isPointInside(x, y)) continue;
      isBottleClicked = true;
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
        this.bottleAnimationManager.startSwapAnimation(
          this.bottles[this.bottleClicked[0]],
          this.bottles[this.bottleClicked[1]],
          ...this.bottleClicked
        );
        this.bottleClicked = [];
      }
    }

    if (!isBottleClicked && this.bottleClicked.length > 0) {
      this.clearBottleSelection();
      this.render(this.ctx);
    }
  }

  clearBottleSelection() {
    while (this.bottleClicked.length > 0) {
      const bottleIndex = this.bottleClicked.pop();
      this.bottles[bottleIndex].clearState();
    }
  }

  /**
   * Draw
   */
  drawCorrectCount() {
    const baseScoreFontSize = 20;
    const correctTextPrefix = `正确个数: `;
    const textX = 20;
    const textY = 155;

    this.scoreAnimationManager.checkAndTriggerAnimation(GameGlobal.databus.correctCnt);
    const animationState = this.scoreAnimationManager.getAnimationState();
    setFont(this.ctx, baseScoreFontSize);
    this.ctx.fillStyle = '#333333';
    this.ctx.fillText(correctTextPrefix, textX, textY);

    const animatedFontSize = baseScoreFontSize * animationState.fontSizeMultiplier;
    setFont(this.ctx, animatedFontSize, undefined, animationState.isBold); 
    this.ctx.fillStyle = animationState.color;

    const textMetricsPrefix = this.ctx.measureText(correctTextPrefix);
    this.ctx.fillText(
      GameGlobal.databus.correctCnt.toString(),
      textX + textMetricsPrefix.width,
      textY
    );
    
    setFont(this.ctx, baseScoreFontSize);
    this.ctx.fillStyle = '#333333';
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
   * Animation
   */
  setupBottleAnimationCallbacks() {
    this.bottleAnimationManager.setOnAnimationUpdate(() => {
      this.render(this.ctx);
    });

    this.bottleAnimationManager.setOnAnimationComplete((animationData) => {
      this.handleBottleAnimationComplete(animationData);
    });
    this.bottleAnimationManager.setPreset(ANIMATION_MODE.FAST);
  }

  handleBottleAnimationComplete(animationData) {
    const [index1, index2] = animationData.indices;
    GameGlobal.databus.swapBottles(index1, index2);
    this.scoreAnimationManager.checkAndTriggerAnimation(GameGlobal.databus.correctCnt);
    if (GameGlobal.databus.checkVictory()) {
      this.changeIntoVictory();
    }
    this.render(this.ctx);
  }

  handleBottleAnimationInProgress() {
    if (this.bottleAnimationManager.getIsAnimating()) {
      wx.showToast({
        title: '动画进行中，请稍后...',
        icon: 'none',
        duration: 500
      });
      return;
    }
  }

  setupScoreAnimationCallbacks() {
    this.scoreAnimationManager.setOnAnimationUpdate(() => {
      this.render(this.ctx);
    });
    this.scoreAnimationManager.initialize(GameGlobal.databus.correctCnt);
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
