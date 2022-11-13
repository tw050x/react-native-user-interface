
/**
 * 
 * @param {number} hour
 * @returns {string}
 */
const padHours = (hour: number) => String(hour).padStart(2, '0');

//
export default padHours;
