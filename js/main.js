import {PIXEL_RATIO} from './render';
import GameInfo from './runtime/gameinfo';
import DataBus from './databus';

const ctx = canvas.getContext('2d');
ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

GameGlobal.databus = new DataBus();

export default class Main {
  gameInfo = new GameInfo();
  
  constructor() {
    this.start();
  }

  start() {
    console.log(">>>> Start game");
    GameGlobal.databus.reset();
    this.newRound();
  }

  newRound() {
    GameGlobal.databus.initNewGame();
    this.render();
  }

  render() {
    console.log(">>> Render game");
    this.gameInfo.render(ctx);
  }
}
