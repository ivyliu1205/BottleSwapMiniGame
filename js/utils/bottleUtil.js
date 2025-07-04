import { BOTTLE_WIDTH, BOTTLE_HEIGHT, BOTTLE_SPACING, MAX_BOTTLE_PER_ROW } from '../constants';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';

/**
 * Calculate the positions of bottles 
 * Place all bottles in the center of the screen
 * 
 * @param {*} bottleIndexes The indexes of the bottles
 * @param {*} bottleScale The scale of bottle size, newSize = BOTTLE_WIDTH * bottleScale
 * @returns List of objects in format of [color_index, posX, posY]
 */
export function calculateBottlePositions(bottleIndexes, bottleScale = 1, customContainer = null) {
  const n = bottleIndexes.length;
  const bottleWidth = BOTTLE_WIDTH * bottleScale;
  const bottleHeight = BOTTLE_HEIGHT * bottleScale;
  const bottleSpacing = BOTTLE_SPACING * bottleScale;
  
  const containerWidth = customContainer ? customContainer.width : SCREEN_WIDTH;
  const containerHeight = customContainer ? customContainer.height : SCREEN_HEIGHT;
  const containerX = customContainer ? customContainer.x : 0;
  const containerY = customContainer ? customContainer.y : 0;

  const positions = [];
  if (n <= 5) {
    const totalWidth = n * bottleWidth + (n - 1) * bottleSpacing;
    const startX = containerX + (containerWidth - totalWidth) / 2;
    const y = containerY + (containerHeight - bottleHeight) / 2;
    
    bottleIndexes.forEach((colorIdx, idx) => {
      const x = startX + idx * (bottleWidth + bottleSpacing);
      positions.push([colorIdx, x, y]);
    });
    return positions;
  }

  const rows = Math.ceil(n / MAX_BOTTLE_PER_ROW);
  const bottlesPerRow = Math.floor(n / rows);
  const extraBottles = n % rows;

  const rowCounts = [];
  for (let i = 0; i < rows; i++) {
    rowCounts[i] = bottlesPerRow + (i < extraBottles ? 1 : 0);
  }
  
  const totalHeight = rows * bottleHeight + (rows - 1) * bottleSpacing;
  const startY = containerY + (containerHeight - totalHeight) / 2;

  let bottleIndex = 0;
  for (let row = 0; row < rows; row++) {
    const currentRowCount = rowCounts[row];
    const currentRowWidth = currentRowCount * bottleWidth + (currentRowCount - 1) * bottleSpacing;
    const currentRowStartX = containerX + (containerWidth - currentRowWidth) / 2;
    
    for (let col = 0; col < currentRowCount; col++) {
      const x = currentRowStartX + col * (bottleWidth + bottleSpacing);
      const y = startY + row * (bottleHeight + bottleSpacing);
      
      const colorIdx = bottleIndexes[bottleIndex];
      positions.push([colorIdx, x, y]);
      bottleIndex++;
    }
  }
  return positions;
}
