import { TestBed } from '@angular/core/testing';
import { PeriodWidth, samePeriod, startOfPeriod } from './period';

describe('period', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
    ]
  }));

  const startDate = '2019-04-11T10:34:36.844Z';

  /*
   * Test that start of period is correct and according to the locale.
   */
  it('should be the start of the year', () => {
    const date = new Date();
    date.setFullYear(2019, 0, 1);
    date.setHours(0, 0, 0, 0);
    const startOf2019: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse(startDate)), PeriodWidth.YEAR)
        .getTime())
          .toBe(startOf2019);
  });
  it('should be the start of the month', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 1);
    date.setHours(0, 0, 0, 0);
    const startOfApril: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse(startDate)), PeriodWidth.MONTH)
        .getTime())
          .toBe(startOfApril);
  });
  it('should be the start of the week', () => {
    const date = new Date();
    date.setFullYear(2018, 11, 31);
    date.setHours(0, 0, 0, 0);
    const startOfWeek: number = date.getTime();
    expect(startOfPeriod(
     new Date(new Date().setFullYear(2019, 0, 6)), PeriodWidth.WEEK)
      .getTime())
       .toBe(startOfWeek);
    expect(startOfPeriod(
     new Date(new Date().setFullYear(2019, 0, 1)), PeriodWidth.WEEK)
      .getTime())
       .toBe(startOfWeek);
  });
  it('should be the start of the day', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(0, 0, 0, 0);
    const startOfDay: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse(startDate)), PeriodWidth.DAY)
        .getTime())
          .toBe(startOfDay);
  });
  it('should be the start of the hour', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(10, 0, 0, 0);
    const startOfDay: number = date.getTime();
    date.setHours(10, 49, 32, 233);
    expect(startOfPeriod(date, PeriodWidth.HOUR)
        .getTime())
          .toBe(startOfDay);
  });

  /**
   * Test that points withing the same period are considered so.
   */
  it('should match points within the same year', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 1, 20)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidth.YEAR
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 20)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidth.YEAR
    )).toBeTruthy();
  });
  it('should not match points not within the same year', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2018, 11, 31)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidth.YEAR
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(2070, 11, 31)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidth.YEAR
    )).toBeFalsy();
  });
  it('should match points within the same month', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 0, 31)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidth.MONTH
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 11, 1)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidth.MONTH
    )).toBeTruthy();
  });
  it('should not match points not within the same month', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 1, 1)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidth.MONTH
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 1)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidth.MONTH
    )).toBeFalsy();
  });
  it('should match points within the same week', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 3, 14)),
      new Date(new Date().setFullYear(2019, 3, 8)),
      PeriodWidth.WEEK
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(2018, 11, 31)),
      new Date(new Date().setFullYear(2019, 0, 6)),
      PeriodWidth.WEEK
    )).toBeTruthy();
  });
  it('should not match points not within the same week', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 3, 14)),
      new Date(new Date().setFullYear(2019, 3, 15)),
      PeriodWidth.WEEK
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 1)),
      new Date(new Date().setFullYear(1971, 1, 1)),
      PeriodWidth.WEEK
    )).toBeFalsy();
  });
  it('should match points within the same day', () => {
    expect(samePeriod(
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 999)),
      PeriodWidth.DAY
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setHours(12, 34, 31, 324)),
      new Date(new Date().setHours(15, 23, 29, 972)),
      PeriodWidth.DAY
    )).toBeTruthy();
  });
  it('should not match points not within the same day', () => {
    const day1 = new Date(2018, 11, 31);
    const day2 = new Date(2019, 0, 1);
    expect(samePeriod(day1, day2, PeriodWidth.DAY)).toBeFalsy();
    expect(samePeriod(
      new Date(day1.setHours(23, 59, 59, 999)),
      new Date(day2.setHours(0, 0, 0, 0)),
      PeriodWidth.DAY
    )).toBeFalsy();
  });
  it('should match points within the same hour', () => {
    expect(samePeriod(
      new Date(new Date().setHours(23, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 999)),
      PeriodWidth.HOUR
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setHours(15, 34, 31, 324)),
      new Date(new Date().setHours(15, 23, 29, 972)),
      PeriodWidth.HOUR
    )).toBeTruthy();
  });
  it('should not match points not within the same hour', () => {
    expect(samePeriod(
      new Date(new Date().setHours(23, 59, 59, 999)),
      new Date(new Date().setHours(0, 0, 0, 0)),
      PeriodWidth.HOUR
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setHours(1, 0, 0, 0)),
      new Date(new Date().setHours(0, 0, 0, 0)),
      PeriodWidth.HOUR
    )).toBeFalsy();
  });
});
