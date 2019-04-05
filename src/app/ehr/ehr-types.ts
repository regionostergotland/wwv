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

  constructor(type: DataTypeEnum, label: string,
              description: string, required: boolean) {
    this.type = type;
    this.label = label;
    this.description = description;
    this.required = required;
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
}

/**
 * Corresponding data type for DV_DATE_TIME in openEHR.
 */
export class DataTypeDateTime extends DataType {
  constructor(label: string, description: string, required: boolean) {
    super(DataTypeEnum.DATE_TIME, label, description, required);
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
    return v1.valueOf() === v2.valueOf();
  }
}

/**
 * Corresponding data type for DV_TEXT in openEHR.
 */
export class DataTypeText extends DataType {
  constructor(label: string, description: string, required: boolean) {
    super(DataTypeEnum.TEXT, label, description, required);
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
    return [ value ];
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

  constructor(label: string, description: string, required: boolean,
              options: DataTypeCodedTextOpt[]) {
    super(DataTypeEnum.CODED_TEXT, label, description, required);
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
    return [ {
      '|code': value,
    } ];
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

  constructor(label: string, description: string, required: boolean,
              unit: string, magnitudeMin: number, magnitudeMax: number) {
    super(DataTypeEnum.QUANTITY, label, description, required);
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
    return [ {
      '|magnitude': value,
      '|unit': this.unit
    }];
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

  constructor(values= []) {
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
        if (!dataType.equal(p.get(typeId), this.get(typeId))) {
          return false;
        }
      }
    }

    return true;
  }
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

  // TODO use these for processing
  private width: number;
  private mathFunction: MathFunctionEnum;

  constructor(spec: CategorySpec) {
    this.spec = spec;

    this.points = [];

    this.width = 0;
    this.mathFunction = MathFunctionEnum.ACTUAL;
  }

  // make lambda?
  private sortByEarliestComparator(p1: DataPoint, p2: DataPoint) {
    return (p1.get('time').getTime() - p2.get('time').getTime());
  }

  private containsPoint(newPoint: DataPoint): boolean {
    for (const point of this.points) {
      if (newPoint.equals(point, this.spec.dataTypes)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a point to the data list.
   */
  public addPoint(point: DataPoint) {
    for (const [typeId, value] of point.entries()) {
      if (!this.getDataType(typeId).isValid(value)) {
        throw TypeError(value + ' invalid value for ' + typeId);
      }
    }
    if (!this.containsPoint(point)) {
      this.points.push(point);
    }
    this.points.sort(this.sortByEarliestComparator);
  }

  /**
   * Add multiple points to the data list.
   */
  public addPoints(points: DataPoint[]) {
    for (const point of points) {
      for (const [typeId, value] of point.entries()) {
        if (!this.getDataType(typeId).isValid(value)) {
          throw TypeError(value + ' invalid value for ' + typeId);
        }
      }
      if (!this.containsPoint(point)) {
        this.points.push(point);
      }
    }
    this.points.sort(this.sortByEarliestComparator);
  }

  /**
   * Get all data points from list, processed according to options.
   */
  public getPoints(): DataPoint[] {
    const points = this.points.slice();
    // TODO process
    return points;
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
   * Replace all points with new list of points.
   */
  public setPoints(points: DataPoint[]) {
    this.points = [];
    this.addPoints(points);
  }

  /**
   * Set the width of intervals that data points shall represent.
   */
  public setWidth(width: number): void {
    this.width = width;
  }

  /**
   * Set math function that will determing value for point of an interval.
   */
  public setMathFunction(mathFunction: MathFunctionEnum): void {
    this.mathFunction = mathFunction;
  }
}
