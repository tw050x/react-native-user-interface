import getCalendarWeeksForDate, { CalendarDay, MAX_CALENDAR_WEEKS } from './get-calendar-weeks-for-date';

const ymd = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');

const allDays = (date: Date): Array<CalendarDay> => getCalendarWeeksForDate(date).flatMap((week) => week.days);

describe('getCalendarWeeksForDate', () => {
  it.each([
    // [month, first shown, last shown, weeks]
    ['2026-01 (starts Thursday, 31 days)', new Date(2026, 0, 15), '2025-12-28', '2026-2-7', 6],
    ['2026-02 (starts Sunday, 28 days)', new Date(2026, 1, 15), '2026-1-25', '2026-3-7', 6],
    ['2026-07 (starts Wednesday, ends Friday)', new Date(2026, 6, 15), '2026-6-28', '2026-8-1', 5],
    ['2026-11 (starts Sunday, 30 days)', new Date(2026, 10, 17), '2026-10-25', '2026-12-5', 6],
    ['2028-02 (leap year, 29 days)', new Date(2028, 1, 10), '2028-1-30', '2028-3-4', 5],
  ])('%s', (_, date, firstShown, lastShown, weekCount) => {
    const weeks = getCalendarWeeksForDate(date);
    const days = weeks.flatMap((week) => week.days);

    expect(weeks).toHaveLength(weekCount);
    expect(ymd(days[0].date)).toBe(firstShown);
    expect(ymd(days[days.length - 1].date)).toBe(lastShown);
  });

  it('gives every week seven days, Sunday to Saturday', () => {
    for (let month = 0; month < 24; month++) {
      for (const week of getCalendarWeeksForDate(new Date(2026, month, 1))) {
        expect(week.days.map((day) => day.date.getDay())).toEqual([0, 1, 2, 3, 4, 5, 6]);
      }
    }
  });

  it('lists consecutive days with no gaps', () => {
    const days = allDays(new Date(2026, 2, 1));

    for (let index = 1; index < days.length; index++) {
      const expected = new Date(days[index - 1].date);
      expected.setDate(expected.getDate() + 1);

      expect(ymd(days[index].date)).toBe(ymd(expected));
    }
  });

  it('includes every day of the month exactly once, flagged as the current month', () => {
    const currentMonthDays = allDays(new Date(2026, 1, 15)).filter((day) => day.isCurrentMonth);

    expect(currentMonthDays.map((day) => day.monthDay)).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
    expect(currentMonthDays.every((day) => day.date.getMonth() === 1)).toBe(true);
  });

  it('flags padding days as previous or next month', () => {
    const days = allDays(new Date(2026, 6, 15));

    expect(days.filter((day) => day.isPreviousMonth).map((day) => ymd(day.date))).toEqual(['2026-6-28', '2026-6-29', '2026-6-30']);
    expect(days.filter((day) => day.isNextMonth).map((day) => ymd(day.date))).toEqual(['2026-8-1']);
    expect(days.every((day) => Number(day.isPreviousMonth) + Number(day.isCurrentMonth) + Number(day.isNextMonth) === 1)).toBe(true);
  });

  it('always shows at least one day of the previous and the next month', () => {
    for (let month = 0; month < 48; month++) {
      const days = allDays(new Date(2026, month, 1));

      expect(days[0].isPreviousMonth).toBe(true);
      expect(days[days.length - 1].isNextMonth).toBe(true);
    }
  });

  it(`never needs more than ${MAX_CALENDAR_WEEKS} weeks`, () => {
    for (let month = 0; month < 600; month++) {
      expect(getCalendarWeeksForDate(new Date(2000, month, 1)).length).toBeLessThanOrEqual(MAX_CALENDAR_WEEKS);
    }
  });

  it('crosses year boundaries', () => {
    const days = allDays(new Date(2026, 11, 10));

    expect(ymd(days[days.length - 1].date)).toBe('2027-1-2');
  });
});
