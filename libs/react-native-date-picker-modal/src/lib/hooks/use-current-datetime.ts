import { useEffect, useState } from 'react'

//
type UserDateReturnValue = {
  currentDatetime: Date
}

/**
 *
 * @returns {UserDateReturnValue}
 */
const useCurrentDatetime = (): UserDateReturnValue => {
  const [currentDatetime, setCurrentDatetime] = useState<Date>(new Date())

  useEffect(() => {
    const date = currentDatetime
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 0, 0, 0)

    setCurrentDatetime(date)

    const millisecondsToMidnight = midnight.getTime() - new Date().getTime()
    const timeoutId = setTimeout(() => setCurrentDatetime(midnight), millisecondsToMidnight)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [currentDatetime])

  return {
    currentDatetime,
  }
}

//
export default useCurrentDatetime
