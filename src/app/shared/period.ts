/*
 * All dates are considered in the local timezone.
 */

/*
 * Possible spans of intervals/periods.
 */
export enum PeriodWidth {
  POINT,
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export function periodString(period: PeriodWidth): string {
  const periods: Map<PeriodWidth, string> = new Map([
    [PeriodWidth.POINT, 'Per punkt'],
    [PeriodWidth.HOUR, 'Per timme'],
    [PeriodWidth.DAY, 'Per dygn'],
    [PeriodWidth.WEEK, 'Per vecka'],
    [PeriodWidth.MONTH, 'Per månad'],
    [PeriodWidth.YEAR, 'Per år'],
  ]);
  return periods.get(period);
}

/*
 * Calculate the start of the period that a date is within.
 * example:
 *    12:00 on 23 feb 2019, span=month
 *      returns
 *    00:00 on 1 feb 2019
 */
export function startOfPeriod(time: Date, span: PeriodWidth): Date {
  const beg: Date = new Date(0);
  beg.setHours(0, 0, 0, 0); // adjust for local timezone
  switch (span) {
  case PeriodWidth.POINT:
    beg.setTime(time.getTime());
    break;
  case PeriodWidth.WEEK:
    // set the same day
    beg.setFullYear(time.getFullYear(), time.getMonth(), time.getDate());
    // set to monday the same week
    const msInADay = 1000 * 3600 * 24;
    const timeOffset = ((((beg.getDay() - 1) % 7) + 7) % 7) * msInADay;
    beg.setTime(beg.getTime() - timeOffset);
    break;
  case PeriodWidth.HOUR:
    beg.setHours(time.getHours());
    /* falls through */
  case PeriodWidth.DAY:
    beg.setDate(time.getDate());
    /* falls through */
  case PeriodWidth.MONTH:
    beg.setMonth(time.getMonth());
    /* falls through */
  case PeriodWidth.YEAR:
    beg.setFullYear(time.getFullYear());
  }
  return beg;
}

/*
 * Determine if two dates are within the same time period.
 */
export function samePeriod(t1: Date, t2: Date,
                           span: PeriodWidth): boolean {
  switch (span) {
    case PeriodWidth.POINT:
      return t1.getTime() === t2.getTime();
    case PeriodWidth.WEEK:
      return t1.getWeek() === t2.getWeek() &&
             t1.getWeekYear() === t2.getWeekYear();
    case PeriodWidth.HOUR:
      if (t1.getHours() !== t2.getHours()) {
        return false;
      }
      /* falls through */
    case PeriodWidth.DAY:
      if (t1.getDate() !== t2.getDate()) {
        return false;
      }
      /* falls through */
    case PeriodWidth.MONTH:
      if (t1.getMonth() !== t2.getMonth()) {
        return false;
      }
      /* falls through */
    case PeriodWidth.YEAR:
      if (t1.getFullYear() !== t2.getFullYear()) {
        return false;
      }
  }
  return true;
}

