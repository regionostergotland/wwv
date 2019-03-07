export interface CategorySpec {
    id: string,
    label: string,
    description: string,
    dataTypes: Map<string, DataType>
}

export enum DataTypeEnum {
    TEXT,
    DATE_TIME,
    CODED_TEXT,
    QUANTITY
}

export abstract class DataType {
    readonly type: DataTypeEnum;
    readonly label: string;
    readonly description: string;

    constructor(type: DataTypeEnum, label: string, description: string) {
        this.type = type;
        this.label = label;
        this.description = description;
    }

    public abstract isValid(value: any): boolean;
}

export class DataTypeDateTime extends DataType {
    constructor(label: string, description: string) {
        super(DataTypeEnum.DATE_TIME, label, description);
    }

    public isValid(value: any): boolean {
        return (value instanceof Date);
    }
}

export class DataTypeText extends DataType {
    constructor(label: string, description: string) {
        super(DataTypeEnum.TEXT, label, description);
    }

    public isValid(value: any): boolean {
        return (typeof value === "string");
    }
}

export interface DataTypeCodedTextOpt {
    readonly id: string;
    readonly label: string;
    readonly description: string;
}

export class DataTypeCodedText extends DataType {
    public readonly options: DataTypeCodedTextOpt[];

    constructor(label: string, description: string,
                options: DataTypeCodedTextOpt[]) {
        super(DataTypeEnum.CODED_TEXT, label, description);
        this.options = options;
    }

    public isValid(value: any): boolean {
        if (typeof value !== "string") {
            return false;
        }
        return this.options.some(e => e.id === value);
    }
}

export class DataTypeQuantity extends DataType {
    public readonly unit: string;
    public readonly magnitude_min: number;
    public readonly magnitude_max: number;

    constructor(label: string, description: string,
                unit: string, magnitude_min: number, magnitude_max: number) {
        super(DataTypeEnum.QUANTITY, label, description);
        this.unit = unit;
        this.magnitude_min = magnitude_min;
        this.magnitude_max = magnitude_max;
    }

    public isValid(value: any): boolean {
        if (typeof value !== "number") {
            return false;
        }
        return this.magnitude_min <= value && value <= this.magnitude_max;
    }
}

export class DataPoint {
    public removed: boolean;

    private values: Map<string, any>; 
    private readonly types: Map<string, DataType>; 

    constructor(catSpec: CategorySpec, values=[]) {
        this.values = new Map<string, any>();
        this.types = catSpec.dataTypes;

        for (let id of catSpec.dataTypes.keys()) {
            this.values.set(id, null)
        }

        this.setMultiple(values);
    }

    public getValues(): object {
        return new Map(this.values);
    }

    public getValue(typeId: string): any {
        return this.values.get(typeId);
    }

    public getDataType(typeId: string): DataType {
        return this.types.get(typeId);
    }

    public set(typeId: string, value: any) {
        if (this.types.get(typeId).isValid(value)) {
            this.values.set(typeId, value)
        } else {
            throw TypeError("invalid type");
        }
    }

    public setMultiple(values) {
        for (let [typeId, value] of values) {
            this.set(typeId, value);
        }
    }

    public getCodedTextOptions(typeId: string): DataTypeCodedTextOpt[] {
        // TODO throw exception?
        let codedTextDataType = this.types.get(typeId) as DataTypeCodedText;
        return codedTextDataType.options;
    }
}

export enum MathFunctionEnum {
    ACTUAL,
    MEDIAN,
    MEAN,
    TOTAL,
}

export class Category {
    private original: DataPoint[] = [];
    private width: number; // TODO special type
    private mathFunction: MathFunctionEnum;
    // TODO store category spec?

    constructor() { }

    public getPoints(): DataPoint[] {
        // TODO process
        return this.original;
    }

    public addPoint(point: DataPoint): void {
        // TODO check if points of category type
        this.original.push(point);
    }

    public addPoints(points: DataPoint[]): void {
        for (let point of points) {
            this.addPoint(point);
        }
    }

    public setWidth(width: number): void {
        this.width = width;
    }

    public setMathFunction(mathFunction: MathFunctionEnum): void {
        this.mathFunction = mathFunction;
    }
}
