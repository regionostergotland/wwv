/*
 * All dates are considered in the local timezone.
 */

/*
 * Possible widths of intervals/periods.
 */
export enum PeriodWidths {
  POINT,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

/*
 * Calculate the start of the period that a date is within.
 * example:
 *    12:00 on 23 feb 2019, width=month
 *      returns
 *    00:00 on 1 feb 2019
 */
export function startOfPeriod(time: Date, width: PeriodWidths): Date {
  const beg: Date = new Date(0);
  beg.setHours(0, 0, 0, 0); // adjust for local timezone
  switch (width) {
  case PeriodWidths.POINT:
    beg.setTime(time.getTime());
    break;
  case PeriodWidths.WEEK:
    // set the same day
    beg.setFullYear(time.getFullYear(), time.getMonth(), time.getDate());
    // set to monday the same week
    const msInADay = 1000 * 3600 * 24;
    const timeOffset = ((((beg.getDay() - 1) % 7) + 7) % 7) * msInADay;
    beg.setTime(beg.getTime() - timeOffset);
    break;
  case PeriodWidths.HOUR:
    beg.setHours(time.getHours());
    /* falls through */
  case PeriodWidths.DAY:
    beg.setDate(time.getDate());
    /* falls through */
  case PeriodWidths.MONTH:
    beg.setMonth(time.getMonth());
    /* falls through */
  case PeriodWidths.YEAR:
    beg.setFullYear(time.getFullYear());
  }
  return beg;
}

/*
 * Determine if two dates are within the same time period.
 */
export function samePeriod(t1: Date, t2: Date,
                           width: PeriodWidths): boolean {
  switch (width) {
    case PeriodWidths.POINT:
      return t1.getTime() === t2.getTime();
    case PeriodWidths.WEEK:
      return t1.getWeek() === t2.getWeek() &&
             t1.getWeekYear() === t2.getWeekYear();
    case PeriodWidths.HOUR:
      if (t1.getHours() !== t2.getHours()) {
        return false;
      }
      /* falls through */
    case PeriodWidths.DAY:
      if (t1.getDate() !== t2.getDate()) {
        return false;
      }
      /* falls through */
    case PeriodWidths.MONTH:
      if (t1.getMonth() !== t2.getMonth()) {
        return false;
      }
      /* falls through */
    case PeriodWidths.YEAR:
      if (t1.getFullYear() !== t2.getFullYear()) {
        return false;
      }
  }
  return true;
}

