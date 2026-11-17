import getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep from './get-datetime';
import getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep from './get-selected-datetime-boundary-index';
import getTimeBoundaryIndexesFromTimeStep from './get-time-boundary-indexes';
import type { TimeStep } from '../types';

describe('getTimeBoundaryIndexesFromTimeStep', () => {
  it.each([
    [1, 1441],
    [5, 289],
    [15, 97],
    [60, 25],
  ] as Array<[TimeStep, number]>)('with a %s minute step returns %i indexes, covering 00:00 to 24:00', (timeStep, length) => {
    const indexes = getTimeBoundaryIndexesFromTimeStep(timeStep);

    expect(indexes).toHaveLength(length);
    expect(indexes[0]).toBe(0);
    expect(indexes[indexes.length - 1]).toBe(length - 1);
  });

  it('accepts the time step as a string', () => {
    expect(getTimeBoundaryIndexesFromTimeStep('15')).toHaveLength(97);
  });
});

describe('getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep', () => {
  it.each([
    ['00:00', 5, 0],
    ['14:35', 5, 175],
    ['14:37', 5, 175],
    ['14:37', 15, 58],
    ['23:59', 1, 1439],
    ['23:59', 60, 23],
  ] as Array<[string, TimeStep, number]>)('maps %s with a %s minute step to index %i', (time, timeStep, index) => {
    const [hours, minutes] = time.split(':').map(Number);

    expect(getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep(new Date(2026, 10, 17, hours, minutes, 45), timeStep)).toBe(index);
  });
});

describe('getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep', () => {
  const baseDate = new Date(2026, 1, 3, 9, 41, 27, 500);

  it('returns the time for the index on the base date, with seconds and milliseconds zeroed', () => {
    expect(getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(175, 5, baseDate)).toEqual(new Date(2026, 1, 3, 14, 35, 0, 0));
  });

  it('does not modify the base date', () => {
    getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(175, 5, baseDate);

    expect(baseDate).toEqual(new Date(2026, 1, 3, 9, 41, 27, 500));
  });

  it('defaults to today when no base date is given', () => {
    const today = new Date();
    const result = getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(0, 5);

    expect([result.getFullYear(), result.getMonth(), result.getDate()]).toEqual([today.getFullYear(), today.getMonth(), today.getDate()]);
    expect([result.getHours(), result.getMinutes(), result.getSeconds(), result.getMilliseconds()]).toEqual([0, 0, 0, 0]);
  });

  it.each([1, 5, 10, 15, 30, 60] as Array<TimeStep>)('round-trips every index with a %s minute step', (timeStep) => {
    const indexes = getTimeBoundaryIndexesFromTimeStep(timeStep).slice(0, -1);

    for (const index of indexes) {
      const datetime = getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(index, timeStep, baseDate);

      expect(getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep(datetime, timeStep)).toBe(index);
    }
  });
});
