import ButtonBase from '../base/buttonBase';

const RESET_BUTTON_IMG_SRC = 'images/reset.png';

export default class ResetButton extends ButtonBase {
  constructor(posX, posY, size) {
    super(posX, posY, size, size);

    this.img = wx.createImage();
    this.img.src = RESET_BUTTON_IMG_SRC;

    this.img.onload = () => {
      console.log("Reset button image loaded");
      this.imageLoaded = true;
      this.onImageLoaded && this.onImageLoaded();
    };
    
    this.img.onerror = () => {
      console.error("Failed to load reset button image:", RESET_BUTTON_IMG_SRC);
    };
  }

  setOnImageLoaded(callback) {
    this.onImageLoaded = callback;
  }

  render(ctx) {
    console.log("Render reset");
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
}