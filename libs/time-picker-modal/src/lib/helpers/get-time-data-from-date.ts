
//
export type TimeData = {
  hour: number;
  minutes: number;
}

/**
 * 
 * @param {Date} date
 * @returns {TimeData}
 */
const getTimeDataFromDate = (date: Date): TimeData => {
  return {
    hour: date.getHours(),
    minutes: date.getMinutes(),
  }
};

//
export default getTimeDataFromDate;
