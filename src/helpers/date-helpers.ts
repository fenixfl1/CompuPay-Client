import moment from "moment"
import capitalize from "./capitalize"
import dayjs from "dayjs"

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
export const LONG_DATE_TIME_FORMAT = "dddd D [de] MMMM [del] YYYY h:mm:ss A"
export const LOG_DATE_FORMAT = "dddd D [de] MMMM [del] YYYY"
export const DATE_FORMAT = "DD/MM/YYYY"
export const TIME_FORMAT = "HH:mm"

type StrDate = string | undefined

export const logDate = (date: StrDate): string => {
  if (!date) return ""
  return capitalize(moment(date).format(LOG_DATE_FORMAT))
}

export const dateTime = (date: StrDate): string => {
  if (!date) return ""
  return moment(date).format(DATE_TIME_FORMAT)
}

export const longDateTime = (date: StrDate): string => {
  if (!date) return ""
  return capitalize(moment(date).format(LONG_DATE_TIME_FORMAT))
}

export const date = (date: string): StrDate => {
  if (!date) return ""
  return moment(date).format(DATE_FORMAT)
}

export const compareDate = (
  date: string,
  base: string | Date = new Date()
): number => {
  const dateToCompare = new Date(date)
  const baseDate = typeof base === "string" ? new Date(base) : base

  if (dateToCompare < baseDate) {
    return -1 // date is before base
  } else if (dateToCompare > baseDate) {
    return 1 // date is after base
  } else {
    return 0 // dates are equal
  }
}

export const getTime = (time: dayjs.Dayjs) => {
  return time?.format(TIME_FORMAT)
}

export const toDayjs = (date: string, format = DATE_FORMAT) => {
  return dayjs(date, format)
}
