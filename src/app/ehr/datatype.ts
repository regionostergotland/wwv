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
  MIN,
  MAX,
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
      [MathFunctionEnum.MIN, this.min.bind(this)],
      [MathFunctionEnum.MAX, this.max.bind(this)],
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

  protected min(values: any[]): any {
    return this.only(values);
  }

  protected max(values: any[]): any {
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

  protected min(values: any[]): any {
    return Math.min(...values);
  }

  protected max(values: any[]): any {
    return Math.max(...values);
  }

}
