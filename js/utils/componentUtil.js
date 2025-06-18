import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../render";

export function renderBackgroundShadow(ctx) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

export function renderRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function setFont(ctx, fontSize, fillStype='#000000', isBold=false) {
  ctx.fillStyle = fillStype;
  if (!isBold) {
    ctx.font = `${fontSize}px Arial`;
  } else {
    ctx.font = `bold ${fontSize}px Arial`;
  }
}
