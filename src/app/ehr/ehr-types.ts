/**
 * Specification of a category of health data.
 * Corresponds to a template in openEHR, may be automatically instanced from
 * templates.
 */
export interface CategorySpec {
  /**
   * Identifier used to specify category.
   */
  id: string;

  /**
   * Human readable name for category.
   */
  label: string;

  /**
   * Human readable string for category.
   */
  description: string;

  /**
   * Data types for all possible points in category.
   */
  dataTypes: Map<string, DataType>;
}

/**
 * All possible data types for values in data points.
 */
export enum DataTypeEnum {
  TEXT,
  DATE_TIME,
  CODED_TEXT,
  QUANTITY
}

/**
 * All possible math functions to be used on a list values inside an interval.
 */
export enum MathFunctionEnum {
  ACTUAL,
  MEDIAN,
  MEAN,
  TOTAL,
}

/**
 * Superclass for classes that represent openEHR data types.
 * Instances of DataType correspond to a certain class of values (e.g. weight)
 * of a specific data type (e.g. Quantity).
 *
 * The DataType instance handles validity checking and conversion to JSON for
 * the EHR.
 */
export abstract class DataType {
  /**
   * Used to determine what class or data type an instance is (Quantity, Text
   * etc.).
   */
  readonly type: DataTypeEnum;
  /**
   * Location of field in composition.
   */
  readonly path: string[];
  /**
   * Human readable name for data type.
   */
  readonly label: string;
  /**
   * Human readable description of data type.
   */
  readonly description: string;
  /**
   * Specify if data field is required in composition.
   */
  readonly required: boolean;
  /**
   * Data type corresponds to a set of data instead of just a single point.
   */
  readonly single: boolean;

  constructor(type: DataTypeEnum, path: string[],
              label: string, description: string,
              required: boolean, single: boolean) {
    this.type = type;
    this.path = path;
    this.label = label;
    this.description = description;
    this.required = required;
    this.single = single;
  }

  /**
   * Verify that value is valid type of instance's data type.
   * @param value Value to be tested if valid for instance's data type.
   * @return true if value is valid according to instance, otherwise false.
   */
  public abstract isValid(value: any): boolean;

  /**
   * Convert data value of instance's type to JSON object that can be part of
   * data for REST API call to EHR.
   * @param value Valid value for datatype to be converted.
   * @return Stringified JSON object represantation of value.
   */
  public abstract toRest(value: any): any;

  public equal(v1: any, v2: any): boolean {
    return v1 === v2;
  }

  public truncate(values: any[], fn: MathFunctionEnum): any[] {
    const functions = new Map<MathFunctionEnum, (v: any[]) => any[]>([
      [MathFunctionEnum.ACTUAL, this.only.bind(this)],
      [MathFunctionEnum.MEDIAN, this.median.bind(this)],
      [MathFunctionEnum.MEAN, this.mean.bind(this)],
      [MathFunctionEnum.TOTAL, this.total.bind(this)],
    ]);
    return functions.get(fn)(values);
  }

  protected median(values: any[]): any {
    return this.only(values);
  }

  protected mean(values: any[]): any {
    return this.only(values);
  }

  protected total(values: any[]): any {
    return this.only(values);
  }

  private only(values: any[]): any {
    let equal = true;
    for (const value of values) {
      if (value !== values[0]) {
        equal = false;
        break;
      }
    }
    return equal ? values[0] : undefined;
  }

  public compare(v1: any, v2: any): number {
    if (v1 < v2) {
      return -1;
    } else if (v2 < v1) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * Corresponding data type for DV_DATE_TIME in openEHR.
 */
export class DataTypeDateTime extends DataType {
  constructor(path: string[], label: string, description: string,
              required: boolean, single: boolean) {
    super(DataTypeEnum.DATE_TIME, path, label, description, required, single);
  }

  /**
   * Verify that value is a Date object.
   * @param value Value to be tested.
   * @return true if value is a non-null Date object.
   */
  public isValid(value: any): boolean {
    return (value instanceof Date);
  }

  public toRest(value: any): any {
    return [value.toISOString()];
  }

  // @override
  public equal(v1: any, v2: any): boolean {
    return v1.getTime() === v2.getTime();
  }
}

/**
 * Corresponding data type for DV_TEXT in openEHR.
 */
export class DataTypeText extends DataType {
  constructor(path: string[], label: string, description: string,
              required: boolean, single: boolean) {
    super(DataTypeEnum.TEXT, path, label, description, required, single);
  }

  /**
   * Verify that value is a string.
   * @param value Value to be tested.
   * @return true if value a non-null string.
   */
  public isValid(value: any): boolean {
    return (typeof value === 'string');
  }

  public toRest(value: any): any {
    return [value];
  }
}

/**
 * Interface for representing a text option of DV_CODED_TEXT.
 */
export interface DataTypeCodedTextOpt {
  /**
   * Code from openEHR template that specifies option.
   */
  readonly code: string;
  /**
   * Human readable name of option.
   */
  readonly label: string;
  /**
   * Human readable description of option.
   */
  readonly description: string;
}

/**
 * Corresponding data type for DV_CODED_TEXT in openEHR.
 */
export class DataTypeCodedText extends DataType {
  /**
   * List of all possible options for coded text.
   */
  public readonly options: DataTypeCodedTextOpt[];

  constructor(path: string[], label: string, description: string,
              required: boolean, single: boolean,
              options: DataTypeCodedTextOpt[]) {
    super(DataTypeEnum.CODED_TEXT, path, label, description, required, single);
    this.options = options;
  }

  /**
   * Verify that value is one of the valid coded options.
   * @param value Value to be checked.
   * @return true if value is one of the possible options, otherwise false.
   */
  public isValid(value: any): boolean {
    return this.options.some(e => e.code === value);
  }

  public toRest(value: any): any {
    return [{
      '|code': value,
    }];
  }
}

/**
 * Corresponding data type for DV_QUANTITY in openEHR.
 */
export class DataTypeQuantity extends DataType {
  /**
   * Unit of data type's value.
   */
  public readonly unit: string;
  /**
   * Minimum value of value.
   */
  public readonly magnitudeMin: number;
  /**
   * Maximum value of value.
   */
  public readonly magnitudeMax: number;

  constructor(path: string[], label: string, description: string,
              required: boolean, single: boolean,
              unit: string, magnitudeMin: number, magnitudeMax: number) {
    super(DataTypeEnum.QUANTITY, path, label, description, required, single);
    this.unit = unit;
    this.magnitudeMin = magnitudeMin;
    this.magnitudeMax = magnitudeMax;
  }

  /**
   * Verify that value is a number within the instance's specified interval
   * [magnitudeMin, magnitudeMax].
   * @param value Value to be tested.
   * @return true if value is a number within the specified interval.
   */
  public isValid(value: any): boolean {
    if (typeof value !== 'number') {
      return false;
    }
    if (value < this.magnitudeMin) {
      return false;
    }
    if (this.magnitudeMax >= 0 && this.magnitudeMax < value) {
      return false;
    }
    return true;
  }

  public toRest(value: any): any {
    return [{
      '|magnitude': value,
      '|unit': this.unit
    }];
  }

  protected median(values: any[]): any {
    values.sort(); // can we assume they are sorted already?
    const n = values.length;
    if (n / 2 === Math.ceil(n / 2)) {
      return values[n / 2];
    } else {
      return (values[Math.ceil(n / 2)] + values[Math.floor(n / 2)]) / 2;
    }
  }

  protected mean(values: any[]): any {
    return this.total(values) / values.length;
  }

  protected total(values: any[]): any {
    return values.reduce((acc, v) => acc + v);
  }
}

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
