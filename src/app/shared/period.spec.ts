import { TestBed } from '@angular/core/testing';
import { PeriodWidths, samePeriod, startOfPeriod } from './period';

describe('period', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
    ]
  }));

  /*
   * Test that start of period is correct and according to the locale.
   */
  it('should be the start of the year', () => {
    const date = new Date();
    date.setFullYear(2019, 0, 1);
    date.setHours(0, 0, 0, 0);
    const startOf2019: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.YEAR)
        .getTime())
          .toBe(startOf2019);
  });
  it('should be the start of the month', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 1);
    date.setHours(0, 0, 0, 0);
    const startOfApril: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.MONTH)
        .getTime())
          .toBe(startOfApril);
  });
  it('should be the start of the week', () => {
    const date = new Date();
    date.setFullYear(2018, 11, 31);
    date.setHours(0, 0, 0, 0);
    const startOfWeek: number = date.getTime();
    expect(startOfPeriod(
     new Date(new Date().setFullYear(2019, 0, 6)), PeriodWidths.WEEK)
      .getTime())
       .toBe(startOfWeek);
    expect(startOfPeriod(
     new Date(new Date().setFullYear(2019, 0, 1)), PeriodWidths.WEEK)
      .getTime())
       .toBe(startOfWeek);
  });
  it('should be the start of the day', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(0, 0, 0, 0);
    const startOfDay: number = date.getTime();
    expect(startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.DAY)
        .getTime())
          .toBe(startOfDay);
  });
  it('should be the start of the hour', () => {
    const date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(10, 0, 0, 0);
    const startOfDay: number = date.getTime();
    date.setHours(10, 49, 32, 233);
    expect(startOfPeriod(date, PeriodWidths.HOUR)
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
      PeriodWidths.YEAR
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 20)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidths.YEAR
    )).toBeTruthy();
  });
  it('should not match points not within the same year', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2018, 11, 31)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidths.YEAR
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(2070, 11, 31)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidths.YEAR
    )).toBeFalsy();
  });
  it('should match points within the same month', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 0, 31)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidths.MONTH
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 11, 1)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidths.MONTH
    )).toBeTruthy();
  });
  it('should not match points not within the same month', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 1, 1)),
      new Date(new Date().setFullYear(2019, 0, 1)),
      PeriodWidths.MONTH
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 1)),
      new Date(new Date().setFullYear(1970, 11, 31)),
      PeriodWidths.MONTH
    )).toBeFalsy();
  });
  it('should match points within the same week', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 3, 14)),
      new Date(new Date().setFullYear(2019, 3, 8)),
      PeriodWidths.WEEK
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setFullYear(2018, 11, 31)),
      new Date(new Date().setFullYear(2019, 0, 6)),
      PeriodWidths.WEEK
    )).toBeTruthy();
  });
  it('should not match points not within the same week', () => {
    expect(samePeriod(
      new Date(new Date().setFullYear(2019, 3, 14)),
      new Date(new Date().setFullYear(2019, 3, 15)),
      PeriodWidths.WEEK
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setFullYear(1970, 1, 1)),
      new Date(new Date().setFullYear(1971, 1, 1)),
      PeriodWidths.WEEK
    )).toBeFalsy();
  });
  it('should match points within the same day', () => {
    expect(samePeriod(
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 999)),
      PeriodWidths.DAY
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setHours(12, 34, 31, 324)),
      new Date(new Date().setHours(15, 23, 29, 972)),
      PeriodWidths.DAY
    )).toBeTruthy();
  });
  it('should not match points not within the same day', () => {
    const day1 = new Date(2018, 11, 31);
    const day2 = new Date(2019, 0, 1);
    expect(samePeriod(day1, day2, PeriodWidths.DAY)).toBeFalsy();
    expect(samePeriod(
      new Date(day1.setHours(23, 59, 59, 999)),
      new Date(day2.setHours(0, 0, 0, 0)),
      PeriodWidths.DAY
    )).toBeFalsy();
  });
  it('should match points within the same hour', () => {
    expect(samePeriod(
      new Date(new Date().setHours(23, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 999)),
      PeriodWidths.HOUR
    )).toBeTruthy();
    expect(samePeriod(
      new Date(new Date().setHours(15, 34, 31, 324)),
      new Date(new Date().setHours(15, 23, 29, 972)),
      PeriodWidths.HOUR
    )).toBeTruthy();
  });
  it('should not match points not within the same hour', () => {
    expect(samePeriod(
      new Date(new Date().setHours(23, 59, 59, 999)),
      new Date(new Date().setHours(0, 0, 0, 0)),
      PeriodWidths.HOUR
    )).toBeFalsy();
    expect(samePeriod(
      new Date(new Date().setHours(1, 0, 0, 0)),
      new Date(new Date().setHours(0, 0, 0, 0)),
      PeriodWidths.HOUR
    )).toBeFalsy();
  });
});
