import { MINUTES_IN_A_DAY } from '../constants';
import type { TimeStep } from '../types';

/**
 *
 * @param {TimeStep} timeStep 
 * @returns {Array<number>}
 */
const getTimeBoundayrIndexesFromTimeStep = (timeStep: TimeStep): Array<number> => {
  return Array.from({ length: (MINUTES_IN_A_DAY / Number(timeStep)) + 1 }, (_, index) => index);;
}

//
export default getTimeBoundayrIndexesFromTimeStep;
