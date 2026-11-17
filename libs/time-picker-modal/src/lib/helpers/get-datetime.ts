import { MINUTES_IN_AN_HOUR } from '../constants';
import type { TimeStep } from '../types';

/**
 * Converts a slider index into a time on `baseDate`'s day. Each index is one
 * `timeStep` of minutes after midnight. Seconds and milliseconds are zeroed.
 *
 * @param {number} selectedIndex
 * @param {TimeStep} timeStep
 * @param {Date} [baseDate] - The day to place the time on. Defaults to today.
 * @returns {Date}
 */
const getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep = (selectedIndex: number, timeStep: TimeStep, baseDate: Date = new Date()): Date => {
  const timeStepAsNumber = Number(timeStep);

  const indexesPerHour = MINUTES_IN_AN_HOUR / timeStepAsNumber;

  const hour = Math.floor(selectedIndex / indexesPerHour);
  const minutes = (selectedIndex % indexesPerHour) * timeStepAsNumber;

  const datetime = new Date(baseDate);

  datetime.setHours(hour, minutes, 0, 0);

  return datetime;
};

//
export default getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep;
