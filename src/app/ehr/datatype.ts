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

export function mathFunctionString(fn: MathFunctionEnum): string {
  const fns: Map<MathFunctionEnum, string> = new Map([
    [MathFunctionEnum.ACTUAL, 'Faktiskt'],
    [MathFunctionEnum.MAX, 'Maximalt'],
    [MathFunctionEnum.MEAN, 'Medelvärde'],
    [MathFunctionEnum.MEDIAN, 'Median'],
    [MathFunctionEnum.MIN, 'Minimalt'],
    [MathFunctionEnum.TOTAL, 'Totalt'],
  ]);
  return fns.get(fn);
}

export interface DataTypeSettings {
  /**
   * Location of field in composition.
   */
  path: string[];

  /**
   * Human readable name for data type.
   */
  label: string;

  /**
   * Human readable description of data type.
   */
  description: string;

  /**
   * Specify if data field is required in composition.
   */
  required: boolean;

  /**
   * Data type corresponds to a set of data in EHR instead of just a single
   * point.
   */
  single: boolean;

  /**
   * Field is a major component of point and shall be visible to the user.
   */
  visible: boolean;

  /**
   *  Field should be visible on mobile, used to save space on smaller screens
   *  where field will be editable from a modal
   */
  visibleOnMobile: boolean;
}

/**
 * Superclass for classes that represent openEHR data types.
 * Instances of DataType correspond to a certain class of values (e.g. weight)
 * of a specific data type (e.g. Quantity).
 *
 * The DataType instance handles validity checking and conversion to JSON for
 * the data to be sent to EHR.
 */
export abstract class DataType {
  /**
   * Used to determine what class or data type an instance is (Quantity, Text
   * etc.).
   */
  readonly type: DataTypeEnum;
  readonly path: string[];
  readonly label: string;
  readonly description: string;
  readonly required: boolean;
  readonly single: boolean;
  readonly visible: boolean;
  readonly visibleOnMobile: boolean;
  readonly unit: string;


  constructor(type: DataTypeEnum, settings: DataTypeSettings) {
    this.type = type;
    this.path = settings.path;
    this.label = settings.label;
    this.description = settings.description;
    this.required = settings.required;
    this.single = settings.single;
    this.visible = settings.visible;
    this.visibleOnMobile = settings.visibleOnMobile;

  }

  /**
   * Verify that value is ia valid type of the instance's data type.
   * @param value value to be tested for validity
   * @return true if value is valid according to instance, otherwise false.
   */
  public abstract isValid(value: any): boolean;

  /**
   * Convert data value of instance's type to JSON object that can be part of
   * the data in the REST API call to EHR.
   * @param value Valid value for datatype to be converted.
   * @return JSON object representation of value that is not stringified
   */
  public abstract toRest(value: any): any;

  /**
   * Determine if two valid values should be considered equal
   */
  public equal(v1: any, v2: any): boolean {
    return v1 === v2;
  }

  /**
   * Compare two valid values and determine if one is considered greater than
   * the other.
   * @returns a positive value if v1 is larger than v2, a negative value if v2
   * is larger than v1 and zero if v1 and v2 are equal to eachother.
   */
  public compare(v1: any, v2: any): number {
    if (v1 < v2) {
      return -1;
    } else if (v2 < v1) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Truncate a list of values to a single value with the specified math
   * function.
   */
  public truncate(values: any[], fn: MathFunctionEnum): any {
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

  /**
   * Used to calculate a default value for mathematical functions for dataTypes
   * which are not suited to mathematical manipulation by nature, such as text.
   */
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

  /*
   * Math functions with default implementations.
   * The default implementation for all math functions simply return undefined
   * if not all values are equal. If all values are equal, the single value
   * that all share is returned.
   * The default should apply to datatypes where math functions are not
   * applicable.
   * Methods should be overridden if math functions are applicable to the
   * datatype.
   */

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
}

/**
 * Corresponding data type for DV_DATE_TIME in openEHR.
 */
export class DataTypeDateTime extends DataType {
  constructor(settings: DataTypeSettings) {
    super(DataTypeEnum.DATE_TIME, settings);
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
    return value.toISOString();
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
  constructor(settings: DataTypeSettings) {
    super(DataTypeEnum.TEXT, settings);
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
    return value;
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

  constructor(settings: DataTypeSettings,
              options: DataTypeCodedTextOpt[]) {
    super(DataTypeEnum.CODED_TEXT, settings);
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
    return {
      '|code': value,
    };
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
   * Minimum value of values.
   */
  public readonly magnitudeMin: number;

  /**
   * Maximum value of values.
   */
  public readonly magnitudeMax: number;

  constructor(settings: DataTypeSettings,
              unit: string, magnitudeMin: number, magnitudeMax: number) {
    super(DataTypeEnum.QUANTITY, settings);
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
    return {
      '|magnitude': value,
      '|unit': this.unit
    };
  }

  protected median(values: any[]): any {
    values.sort();
    const n = values.length;
    if (n % 2 === 0) {
      return (values[n / 2 - 1] + values[n / 2]) / 2;
    } else {
      return values[Math.floor(n / 2)];
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
