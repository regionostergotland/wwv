import { CategorySpec, DataType, MathFunctionEnum } from './datatype';
import { PeriodWidths, startOfPeriod, samePeriod } from '../shared/period';
import '../shared/date.extensions';

/**
 * Map of values to be put in a DataList.
 * Can be thought of as an n-dimensional point or a row in a data table.
 */
export class DataPoint {
  /**
   * XXX Point is marked for removal.
   * -Only to be used for DataList.removePoint to achieve time-complexity n.
   *  Remove if alternative algorithm is found.
   */
  public removed: boolean;
  /**
   * Values for data point.
   */
  private point: Map<string, any>;

  constructor(values = []) {
    this.removed = false;
    this.point = new Map<string, any>(values);
  }

  /**
   * Group a list of points in intervals.
   * group consecutive points if they are in the same period
   * assumption: already sorted by time
   */
  public static groupByInterval(points: DataPoint[],
                                width: PeriodWidths): DataPoint[][] {
    const groups: DataPoint[][] = [[points[0]]];
    for (let p = 1; p < points.length; p++) {
      const p1: DataPoint = points[p - 1];
      const p2: DataPoint = points[p];
      if (samePeriod(p1.get('time'), p2.get('time'), width)) {
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

  /*
   * Check if each pair of values for each required field are equal according
   * to the datatype
   */
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

  /*
   * Compare each pair of values for each required field with the datatype.
   */
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

interface Filter {
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
   * Selected period width.
   */
  width: PeriodWidths;
  /**
   * Processed points for each math function
   */
  private processedPoints: Map<MathFunctionEnum, DataPoint[]>;

  constructor(spec: CategorySpec) {
    this.spec = spec;
    this.points = [];
    this.processedPoints = 
      new Map<MathFunctionEnum, DataPoint[]>([
        [ MathFunctionEnum.ACTUAL, [new DataPoint()] ],
        [ MathFunctionEnum.MEAN, [new DataPoint()] ],
        [ MathFunctionEnum.MEDIAN, [new DataPoint()] ],
        [ MathFunctionEnum.TOTAL, [new DataPoint()] ],
      ]);
    console.log(this.processedPoints)
    this.processedPoints.set(MathFunctionEnum.ACTUAL, []);
    for (let fn in this.processedPoints.keys()) {
      console.log(fn);
      console.log("hej");
    }
    console.log("should have said hej hej hej hej above");
  }

  /**
   * Merge multiple datapoints to single point with a math function based on
   * width.
   * @param points DataPoints to merge
   * @param width time duration that each generated point represents
   * @param fn mathematical function to merge points with
   */
  private mergePoints(points: DataPoint[], width: PeriodWidths,
                      fn: MathFunctionEnum): DataPoint[] {
    if (width === PeriodWidths.POINT || fn === MathFunctionEnum.ACTUAL) {
      return points.slice();
    } else {
      const newPoints: DataPoint[] = [];
      const intervals = DataPoint.groupByInterval(points, width);
      for (const interval of intervals) {
        const newValues: any[] = [];
        for (const [id, dataType] of this.spec.dataTypes.entries()) {
          // TODO move this behaviour to datatypedatetime
          if (id === 'time') {
            const startTime = startOfPeriod(interval[0].get('time'), width);
            newValues.push(['time', startTime]);
          } else {
            const prevValues: any[] = interval.map((p) => p.get(id));
            const newValue: any = dataType.truncate(prevValues, fn);
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
    for (let fn in this.processedPoints.keys()) {
      console.log(fn);
      //this.processedPoints.set(
      //  fn,
      //  this.mergePoints(this.points, this.width, fn)
      //);
    }
  }

  /**
   * Check if list contains any points that are considered equal to the test
   * point.
   * @param testPoint DataPoint to compare against
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
   * @param point DataPoint to add
   */
  public addPoint(point: DataPoint) {
    this.addPoints([point]);
  }

  /**
   * Add multiple points to the data list.
   * @param points list of DataPoints to add
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
   * Removes points from list by checking for equality to given points to be removed.
   * @param points: DataPoint[] is a list of datapoints marked to be removed.
   */
  public removePoints(points: DataPoint[]): void {
    for (const point of points) {
      point.removed = true;
    }
    this.points = this.points.filter(p => !p.removed);
    for (let fn in this.processedPoints.keys()) {
      //this.processedPoints.set(
      //  fn, 
      //  this.processedPoints.get(filter).filter(p => !(p.removed))
      //);
    }
  }

  /**
   * Get all data points from list, processed according to options.
   */
  public getPoints(): DataPoint[] {
    return this.processedPoints.get(MathFunctionEnum.ACTUAL)
      .filter((p) => !p.removed);
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
    //this.width = width;
    //this.mathFunction = mathFunction;
    //this.processPoints();
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

  /**
   * Get interval width for the data list.
   * TODO remove
   */
  public getWidth(): PeriodWidths {
    this.processPoints();
    return PeriodWidths.POINT;
    //return this.filters[0].width;
  }

  /**
   * Get the math function for the data list.
   * TODO remove
   */
  public getMathFunction(): MathFunctionEnum {
    return MathFunctionEnum.ACTUAL;
    //return this.filters[0].mathFunction;
  }

}
