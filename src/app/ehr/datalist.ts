import { CategorySpec,
         DataType,
         MathFunctionEnum,
         mathFunctionString } from './datatype';
import { PeriodWidth,
         periodString,
         startOfPeriod,
         samePeriod } from '../shared/period';
import '../shared/date.extensions';

/**
 * Map of values to be put in a DataList.
 * Can be thought of as an n-dimensional point or a row in a data table.
 */
export class DataPoint {
  /**
   *  Decides if point is marked for removal.
   *  Only used in DataList.removePoint to achieve time-complexity O(n).
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
   * Splits an array of DataPoints into groups of points in the same interval.
   * The points are assumed to already be sorted by time.
   * @param points DataPoints to be split
   * @param span span of interval
   * @returns an array where each element is an array containing all
   * datapoints for one span
   */
   public static groupByInterval(points: DataPoint[],
                                 span: PeriodWidth): DataPoint[][] {
    const groups: DataPoint[][] = [[points[0]]];
    for (let p = 1; p < points.length; p++) {
      const p1: DataPoint = points[p - 1];
      const p2: DataPoint = points[p];
      if (samePeriod(p1.get('time'), p2.get('time'), span)) {
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

  /**
   * Check if each pair of values for all required fields are equal as defined
   * by the datatype
   * @param p DataPoint to compare equality against
   * @param dataTypes dataTypes to check equality for
   */
  public equals(p: DataPoint, dataTypes: Map<string, DataType>): boolean {
    for (const [typeId, dataType] of dataTypes.entries()) {
      if (dataType.required &&
          !dataType.equal(this.get(typeId), p.get(typeId))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Compares each pair of values for all required fields are equal as defined
   * by the datatype. Uses dataType.compare to decide if one point is greater
   * than the other.
   * @param p DataPoint to compare against
   * @param dataTypes dataTypes to compare
   * @returns a number indicating if points are equal, or if one is greater
   * or lesser than the other.
   */
  public compareTo(p: DataPoint, dataTypes: Map<string, DataType>): number {
    for (const [typeId, dataType] of dataTypes.entries()) {
      const cmp: number = dataType.compare(this.get(typeId), p.get(typeId));
      if (dataType.required && cmp !== 0) {
        return cmp;
      }
    }
    return 0;
  }
}


export interface Filter {
  width: PeriodWidth;
  fn: MathFunctionEnum;
}

export function filterString(filter: Filter): string {
  return mathFunctionString(filter.fn) +
         ' ' +
         periodString(filter.width).toLowerCase();
}

const DEFAULT_FILTER: Filter = {
  width: PeriodWidth.POINT,
  fn: MathFunctionEnum.ACTUAL
};

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
   * Cached processed points for each math function.
   */
  private processedPoints: Map<Filter, DataPoint[]>;

  constructor(spec: CategorySpec) {
    this.spec = spec;
    this.points = [];
    this.resetFilter();
  }

  /**
   * Merge multiple datapoints to single point with a math function based on
   * span.
   * @param points DataPoints to merge
   * @param span time duration that each generated point represents
   * @param fn mathematical function to merge points with
   */
  private mergePoints(filter: Filter): DataPoint[] {
    if (filter === DEFAULT_FILTER) {
      return this.points.slice();
    } else {
      const newPoints: DataPoint[] = [];
      const intervals = DataPoint.groupByInterval(this.points, filter.width);
      for (const interval of intervals) {
        const newValues: any[] = [];
        for (const [id, dataType] of this.spec.dataTypes.entries()) {
          // TODO move this behaviour to datatypedatetime
          if (id === 'time') {
            const startTime =
                startOfPeriod(interval[0].get('time'), filter.width);
            newValues.push(['time', startTime]);
          } else {
            const prevValues: any[] = interval.map((p) => p.get(id));
            const newValue: any = dataType.truncate(prevValues, filter.fn);
            newValues.push([id, newValue]);
          }
        }
        newPoints.push(new DataPoint(newValues));
      }
      return newPoints;
    }
  }

  private processPoints() {
    for (const filter of this.processedPoints.keys()) {
      this.processedPoints.set(filter, this.mergePoints(filter));
    }
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
    this.processPoints(); /* reprocess for new points */
  }

  /**
   * Removes points from list by checking for equality against given points to
   * be removed.
   * @param points: a list of datapoints marked to be removed.
   */
  public removePoints(points: DataPoint[]): void {
    for (const point of points) {
      point.removed = true;
    }
    this.points = this.points.filter(p => !p.removed);
    for (const filter of this.processedPoints.keys()) {
      this.processedPoints.set(
        filter,
        this.processedPoints.get(filter).filter(p => !(p.removed))
      );
    }
  }

  /**
   * Get all data points for every applied math function.
   */
  // tslint:disable-next-line
  public getPoints(): Map<Filter, DataPoint[]> {
    return this.processedPoints;
  }

  /**
   * Replace all original points with new list of points.
   */
  public setPoints(points: DataPoint[]) {
    this.points = [];
    this.addPoints(points);
  }

  public resetFilter() {
    this.processedPoints = new Map<Filter, DataPoint[]>([
      [ DEFAULT_FILTER, this.points.slice() ]
    ]);
  }

  public addFilter(filter: Filter) {
    this.processedPoints.delete(DEFAULT_FILTER);
    this.processedPoints.set(filter, this.mergePoints(filter));
  }

  public removeFilter(filter: Filter) {
    this.processedPoints.delete(filter);
    if (this.processedPoints.size === 0) {
      this.resetFilter();
    }
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
}
