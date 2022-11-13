import { MINUTES_IN_AN_HOUR } from '../constants';
import type { TimeStep } from '../types';


/**
 *
 * @param {Date} datetime
 * @param {TimeStep} timeStep
 * @returns {number} 
 */
const getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep = (datetime: Date, timeStep: TimeStep): number => {
  const hour = datetime.getHours();
  const minutes = datetime.getMinutes();

  const timeStepAsNumber = Number(timeStep);

  return (hour * (MINUTES_IN_AN_HOUR / timeStepAsNumber)) + Math.floor(minutes / timeStepAsNumber);
};

//
export default getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep;
