import findClosestNumberInNumbersArray from './find-closest-number-in-numbers-array';
import snapPoint from './snap-point';

// Snap points as the slider produces them: 0, -10, -20, ... (moving left).
const points = [0, -10, -20, -30, -40];

describe('findClosestNumberInNumbersArray', () => {
  it.each([
    [0, 0],
    [-4, 0],
    [-6, -10],
    [-24, -20],
    [-100, -40],
    [50, 0],
  ])('snaps %d to %d', (value, expected) => {
    expect(findClosestNumberInNumbersArray(value, points)).toBe(expected);
  });

  it('picks the later point when two are equally close', () => {
    expect(findClosestNumberInNumbersArray(-5, points)).toBe(-10);
  });
});

describe('snapPoint', () => {
  it('snaps to the nearest point when there is no velocity', () => {
    expect(snapPoint(-12, 0, points)).toBe(-10);
  });

  it('projects the position forward by 0.2 × velocity before snapping', () => {
    // -12 + 0.2 × -100 = -32, nearest is -30.
    expect(snapPoint(-12, -100, points)).toBe(-30);
    // -12 + 0.2 × 100 = 8, nearest is 0.
    expect(snapPoint(-12, 100, points)).toBe(0);
  });

  it('stays within the available points for large velocities', () => {
    expect(snapPoint(-12, -10000, points)).toBe(-40);
    expect(snapPoint(-12, 10000, points)).toBe(0);
  });
});
