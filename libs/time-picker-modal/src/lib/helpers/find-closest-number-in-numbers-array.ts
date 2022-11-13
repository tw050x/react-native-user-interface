
/**
 * 
 * @param {number} number
 * @param {Array<number>} numbers
 * @returns {number}
 */
const findClosestNumberInNumbersArray = (number: number, numbers: Array<number>): number => {
  return numbers.reduce((previous, current) => Math.abs(current - number) <= Math.abs(previous - number) ? current : previous);
};

//
export default findClosestNumberInNumbersArray;
