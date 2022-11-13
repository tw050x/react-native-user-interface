
/**
 *
 * @param {number} positionX
 * @param {number} timeBarWidthAndMargin
 * @param {number} timeSelectorWidth
 * @returns {number}
 */
const getSelectedDatetimeBoundaryIndexFromSliderXPositionAndTimeBarWidth = (positionX: number, timeBarWidthAndMargin: number, timeSelectorWidth: number): number => {
  return -((positionX - (timeSelectorWidth / 2)) / timeBarWidthAndMargin);
};

//
export default getSelectedDatetimeBoundaryIndexFromSliderXPositionAndTimeBarWidth;
