import { CategorySpec, DataType, MathFunctionEnum } from './datatype';
import '../shared/date.extensions';

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

/**
 * Map of values to be put in a DataList.
 * Can be thought of as an n-dimensional point or a row in a data table.
 * Can be marked as removed by modifying the public removed instance variable.
 * Otherwise, works similar to a Map.
 */
export class DataPoint {

  constructor(values = []) {
    this.removed = false;
    this.point = new Map<string, any>(values);
  }
  /**
   * Point is marked for removal.
   */
  public removed: boolean;
  /**
   * Values for data point.
   */
  private point: Map<string, any>;

  public static startOfPeriod(time: Date,
                              width: PeriodWidths): Date {
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
  public static samePeriod(t1: Date, t2: Date,
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

  /**
   * Group a list of points in intervals.
   */
  public static groupByInterval(points: DataPoint[],
                                width: PeriodWidths) {
    const groups: DataPoint[][] = [[points[0]]];
    for (let p = 1; p < points.length - 1; p++) {
      const p1: DataPoint = points[p - 1];
      const p2: DataPoint = points[p];
      if (DataPoint.samePeriod(p1.get('time'), p2.get('time'), width)) {
        groups[groups.length - 1].push(p2);
      } else {
        groups.push([p2]);
      }
    }
    return groups;
  }

  // wrap Map methods because Map can't be extended
  public get(typeId: string): any { return this.point.get(typeId); }
  public set(typeId: string, value: any) { this.point.set(typeId, value); }
  public size(): number { return this.point.size; }
  public values() { return this.point.values(); }
  public keys() { return this.point.keys(); }
  public entries() { return this.point.entries(); }
  public has(typeId: string) { return this.point.has(typeId); }

  public equals(p: DataPoint, dataTypes: Map<string, DataType>): boolean {
    for (const [typeId, dataType] of dataTypes.entries()) {
      if (dataType.required) {
        if (!dataType.equal(this.get(typeId), p.get(typeId))) {
          return false;
        }
      }
    }
    return true;
  }

  public compareTo(p: DataPoint, dataTypes: Map<string, DataType>): number {
    for (const [typeId, dataType] of dataTypes.entries()) {
      if (dataType.required) {
        const comp = dataType.compare(this.get(typeId), p.get(typeId));
        if (comp !== 0) { return comp; }
      }
    }
    return 0;
  }
}

/**
 * List of [[DataPoint]]s with certain [[DataType]]s specified by a
 * [[CategorySpec]].
 */
export class DataList {
  /**
   * Specification for category of data list.
   */
  public readonly spec: CategorySpec;

  /**
   * All data points stored in the list.
   */
  private points: DataPoint[];

  /**
   * Cached list of processed data points.
   */
  private processedPoints: DataPoint[];
  /**
   * Width of processed points in milliseconds.
   */
  private width: number;
  /**
   * Math function used to process points.
   */
  private mathFunction: MathFunctionEnum;

  constructor(spec: CategorySpec) {
    this.spec = spec;
    this.points = [];
    this.processedPoints = [];
    this.width = PeriodWidths.POINT;
    this.mathFunction = MathFunctionEnum.ACTUAL;
  }

  /**
   * Merge multiple datapoints to single point with a math function based on
   * width.
   */
  private mergePoints(points: DataPoint[],
                      width: PeriodWidths,
                      fn: MathFunctionEnum): DataPoint[] {
    if (width === PeriodWidths.POINT || fn === MathFunctionEnum.ACTUAL) {
      return points.slice();
    } else {
      const newPoints: DataPoint[] = [];
      const intervals: DataPoint[][] = DataPoint.groupByInterval(points, width);
      for (const interval of intervals) {
        const newValues: any[] = [];
        for (const [id, dataType] of this.spec.dataTypes.entries()) {
          if (id === 'time') {
            const startTime: Date =
              DataPoint.startOfPeriod(
                interval[0].get('time'), width);
            newValues.push(['time', startTime]);
          } else {
            const prevValues = interval.map((p) => p.get(id));
            const newValue = dataType.truncate(prevValues, fn);
            newValues.push([id, newValue]);
          }
        }
        newPoints.push(new DataPoint(newValues));
      }
      return newPoints;
    }
  }

  /**
   * Process points and cache the result.
   */
  private processPoints() {
    this.processedPoints = this.mergePoints(
      this.points,
      this.width,
      this.mathFunction
    );
  }

  /**
   * Performs a binary search on the list of current points to check if
   * a given point is a duplicate
   * @param newPoint DataPoint to be added
   */
  public containsPoint(testPoint: DataPoint): boolean {
    let start = 0;
    let end = this.points.length - 1;
    while (start <= end) {
      const current = Math.floor((start + end) / 2);
      const point = this.points[current];
      const comp = testPoint.compareTo(point, this.spec.dataTypes);
      if (comp < 0) {
        end = current - 1;
      } else if (comp > 0) {
        start = current + 1;
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a point to the data list.
   */
  public addPoint(point: DataPoint) {
    this.addPoints([point]);
  }

  /**
   * Add multiple points to the data list.
   */
  public addPoints(points: DataPoint[]) {
    // Assumption: none of the new points are duplicates of each other.
    const add: DataPoint[] = [];
    for (const point of points) {
      for (const [typeId, value] of point.entries()) {
        if (!this.getDataType(typeId).isValid(value)) {
          throw TypeError(value + ' invalid value for ' + typeId);
        }
      }
      if (!this.containsPoint(point)) {
        add.push(point);
      }
    }
    Array.prototype.push.apply(this.points, add);
    const compare = (p1, p2) => p1.compareTo(p2, this.spec.dataTypes);
    this.points.sort(compare.bind(this));
    this.processPoints();
  }

  /**
   * Get all data points from list, processed according to options.
   */
  public getPoints(): DataPoint[] {
    return this.processedPoints;
  }

  /**
   * Replace all points with new list of points.
   */
  public setPoints(points: DataPoint[]) {
    this.points = [];
    this.addPoints(points);
  }

  /**
   * Set the width of intervals that data points shall represent, as well as
   * math funciton that will determine the value of the interval.
   */
  public setInterval(width: PeriodWidths, mathFunction: MathFunctionEnum): void {
    this.width = width;
    this.mathFunction = mathFunction;
    this.processPoints();
  }

  /**
   * Get DataType object for certain data type.
   */
  public getDataType(typeId: string): DataType {
    if (this.spec.dataTypes.has(typeId)) {
      return this.spec.dataTypes.get(typeId);
    } else {
      throw TypeError('invalid type id -- ' + typeId);
    }
  }

}
