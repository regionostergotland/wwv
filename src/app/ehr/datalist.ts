import { CategorySpec, DataType, MathFunctionEnum } from './datatype';

/**
 * Map of values to be put in a DataList.
 * Can be thought of as an n-dimensional point or a row in a data table.
 * Can be marked as removed by modifying the public removed instance variable.
 * Otherwise, works similar to a Map.
 */
export class DataPoint {
  /**
   * Point is marked for removal.
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
   * Width of processed points. TODO unit??
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
    this.width = 0;
    this.mathFunction = MathFunctionEnum.ACTUAL;
  }

  /**
   * Merge multiple datapoints to single point with a math function based on
   * width.
   */
  private mergePoints(points: DataPoint[],
                      width: number, fn: MathFunctionEnum): DataPoint[] {
    if (width === 0 || fn === MathFunctionEnum.ACTUAL) {
      return points.slice();
    } else {
      const newPoints: DataPoint[] = [];
      const msInDay: number = 1000 * 60 * 60 * 24; // use shorter min interval?
      while (points[0] !== undefined) {
        const oldestDate: number = points[0].get('time').setHours(0, 0, 0);
        const interval: DataPoint[] = points.filter(p =>
          (p.get('time').getTime() <= oldestDate + width * msInDay));
        points = points.filter(p =>
          (p.get('time').getTime() > oldestDate + width * msInDay));
        // time complexity of filter? linear possible?
        const newValues: any[] = [];
        for (const [id, dataType] of this.spec.dataTypes.entries()) {
          if (id === 'time') {
            newValues.push(['time', new Date(oldestDate)]);
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
  public setInterval(width: number, mathFunction: MathFunctionEnum): void {
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
