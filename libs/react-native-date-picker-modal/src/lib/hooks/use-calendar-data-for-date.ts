import { useMemo } from 'react'

//
type UseCalendarDataForDateReturnValue = {
  monthFirstDayWeekday?: number
  monthFirstDayWeekdayIndex?: number
  month?: number
  monthDay?: number
  monthDayIndex?: number
  monthIndex?: number
  monthLastDay?: number
  monthLastDayIndex?: number
  previousMonthLastMonthDay?: number
  weekDay?: number
  weekDayIndex?: number
  year?: number
}

/**
 *
 * @param {Date} date
 * @returns {UseCalendarDataForDateReturnValue}
 */
const useCalendarDataForDate = (datetime: Date | undefined): UseCalendarDataForDateReturnValue => {
  const data = useMemo(() => {
    if (datetime === undefined) return {}

    const monthIndex = datetime.getMonth()
    const monthDay = datetime.getDate()
    const weekDayIndex = datetime.getDay()
    const year = datetime.getFullYear()

    const month = monthIndex + 1
    const monthDayIndex = monthDay ? monthDay - 1 : undefined
    const monthLastDay = new Date(year, monthIndex + 1, 0).getDate()
    const weekDay = weekDayIndex + 1

    const monthLastDayIndex = monthLastDay ? monthLastDay - 1 : undefined

    const firstDayDate = new Date(year, monthIndex, 1)
    const monthFirstDayWeekdayIndex = firstDayDate.getDay()
    const monthFirstDayWeekday = monthFirstDayWeekdayIndex + 1

    const previousMonthLastDayDate = new Date(firstDayDate)
    previousMonthLastDayDate.setHours(-12)

    const previousMonthLastMonthDay = previousMonthLastDayDate.getDate()

    return {
      monthFirstDayWeekday,
      monthFirstDayWeekdayIndex,
      month,
      monthDay,
      monthDayIndex,
      monthIndex,
      monthLastDay,
      monthLastDayIndex,
      previousMonthLastMonthDay,
      weekDay,
      weekDayIndex,
      year,
    }

  }, [datetime])

  return data
}

//
export default useCalendarDataForDate
