import { MINUTES_IN_AN_HOUR } from '../constants';
import type { TimeStep } from '../types';

/**
 * 
 * @param {number} selectedIndex
 * @param {TimeStep} timeStep
 * @returns {Date}
 */
const getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep = (selectedIndex: number, timeStep: TimeStep): Date => {
  const timeStepAsNumber = Number(timeStep);

  const indexesPerHour = MINUTES_IN_AN_HOUR / timeStepAsNumber;

  const hour = Math.floor(selectedIndex / indexesPerHour);
  const minutes = (selectedIndex % indexesPerHour) * timeStepAsNumber;

  const datetime = new Date();

  datetime.setHours(hour);
  datetime.setMinutes(minutes);

  return datetime;
};

//
export default getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep;
