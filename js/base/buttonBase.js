
export default class ButtonBase {
  constructor(posX, posY, width, height) {
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  isPointInside(x, y) {
    return x >= this.posX && 
            x <= this.posX + this.width && 
            y >= this.posY && 
            y <= this.posY + this.height;
  }
}