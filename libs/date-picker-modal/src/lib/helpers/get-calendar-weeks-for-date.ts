//
export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isNextMonth: boolean;
  isPreviousMonth: boolean;
  monthDay: number;
};

//
export type CalendarWeek = {
  days: Array<CalendarDay>;
};

//
const DAYS_IN_A_WEEK = 7;

/**
 * Builds the weeks shown in the calendar for the month containing `date`.
 *
 * Weeks start on Sunday. The grid always shows at least one day from the
 * previous month and one from the next: when the month starts on a Sunday a
 * full week of the previous month is shown, and when it ends on a Saturday a
 * full week of the next month is shown.
 *
 * @param {Date} date - Any date in the month to show.
 * @returns {Array<CalendarWeek>}
 */
const getCalendarWeeksForDate = (date: Date): Array<CalendarWeek> => {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();

  const firstWeekdayIndex = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days: Array<CalendarDay> = [];

  // Previous month: fill back to Sunday, or a full week if the month starts on a Sunday.
  const previousMonthDayCount = firstWeekdayIndex || DAYS_IN_A_WEEK;
  for (let offset = previousMonthDayCount; offset > 0; offset--) {
    const day = new Date(year, monthIndex, 1 - offset);
    days.push({ date: day, isCurrentMonth: false, isNextMonth: false, isPreviousMonth: true, monthDay: day.getDate() });
  }

  // Current month.
  for (let monthDay = 1; monthDay <= daysInMonth; monthDay++) {
    days.push({ date: new Date(year, monthIndex, monthDay), isCurrentMonth: true, isNextMonth: false, isPreviousMonth: false, monthDay });
  }

  // Next month: fill to Saturday, or a full week if the month ends on a Saturday.
  const nextMonthDayCount = (DAYS_IN_A_WEEK - (days.length % DAYS_IN_A_WEEK)) % DAYS_IN_A_WEEK || DAYS_IN_A_WEEK;
  for (let monthDay = 1; monthDay <= nextMonthDayCount; monthDay++) {
    days.push({ date: new Date(year, monthIndex + 1, monthDay), isCurrentMonth: false, isNextMonth: true, isPreviousMonth: false, monthDay });
  }

  const weeks: Array<CalendarWeek> = [];
  for (let index = 0; index < days.length; index += DAYS_IN_A_WEEK) {
    weeks.push({ days: days.slice(index, index + DAYS_IN_A_WEEK) });
  }

  return weeks;
};

//
export default getCalendarWeeksForDate;
