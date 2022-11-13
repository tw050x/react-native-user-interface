
/**
 *
 * @param {number} number
 * @param {number} quantifier
 * @returns {number}
 */
const roundToNearestInteger = (number: number, quantifier: number): number => {
  return Math.round(number / quantifier) * quantifier;
};

//
export default roundToNearestInteger;
