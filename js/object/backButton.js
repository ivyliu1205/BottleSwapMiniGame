import ButtonBase from '../base/buttonBase';

const BACK_BUTTON_IMG_SRC = 'images/back.png';

export default class BackButton extends ButtonBase {
  constructor(posX, posY, size) {
    super(posX, posY, size, size);

    this.img = wx.createImage();
    this.img.src = BACK_BUTTON_IMG_SRC;

    this.img.onload = () => {
      console.log("Back button image loaded");
      this.imageLoaded = true;
      this.onImageLoaded && this.onImageLoaded();
    };
    
    this.img.onerror = () => {
      console.error("Failed to load Back button image:", BACK_BUTTON_IMG_SRC);
    };
  }

  setOnImageLoaded(callback) {
    this.onImageLoaded = callback;
  }

  render(ctx) {
    console.log("Render back");
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
}