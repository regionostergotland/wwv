export interface CategorySpec {
    id: string;
    label: string;
    description: string;
    dataTypes: Map<string, DataType>;
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
        return (typeof value === 'string');
    }
}

export interface DataTypeCodedTextOpt {
    readonly code: string;
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
        return this.options.some(e => e.code === value);
    }
}

export class DataTypeQuantity extends DataType {
    public readonly unit: string;
    public readonly magnitudeMin: number;
    public readonly magnitudeMax: number;

    constructor(label: string, description: string,
                unit: string, magnitudeMin: number, magnitudeMax: number) {
        super(DataTypeEnum.QUANTITY, label, description);
        this.unit = unit;
        this.magnitudeMin = magnitudeMin;
        this.magnitudeMax = magnitudeMax;
    }

    public isValid(value: any): boolean {
        if (typeof value !== 'number') {
            return false;
        }
        return this.magnitudeMin <= value && value <= this.magnitudeMax;
    }
}

export class DataPoint {
    public removed: boolean;
    private point: Map<string, any>;

    constructor(values= []) {
        this.removed = false;
        this.point = new Map<string, any>(values);
    }

    // wrap Map methods because Map can't be extended
    public get(typeId: string): any { return this.point.get(typeId); }
    public set(typeId: string, value: any) { this.point.set(typeId, value); }
    public values() { return this.point.values(); }
    public keys() { return this.point.keys(); }
    public entries() { return this.point.entries(); }
    public has(typeId: string) { return this.point.has(typeId); }
}

export enum MathFunctionEnum {
    ACTUAL,
    MEDIAN,
    MEAN,
    TOTAL,
}

export class DataList {
    public readonly spec: CategorySpec;

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

    public addPoint(point: DataPoint) {
        for (const [typeId, value] of point.entries()) {
            if (!this.getDataType(typeId).isValid(value)) {
                throw TypeError(value + ' invalid value for ' + typeId);
            }
        }
        this.points.push(point);
    }

    public addPoints(points: DataPoint[]) {
        for (const point of points) {
            this.addPoint(point);
        }
    }

    public getPoints(): DataPoint[] {
        const points = this.points.slice();
        // TODO process
        return points;
    }

    public getDataType(typeId: string): DataType {
        if (this.spec.dataTypes.has(typeId)) {
            return this.spec.dataTypes.get(typeId);
        } else {
            throw TypeError('invalid type id -- ' + typeId);
        }
    }

    public setPoints(points: DataPoint[]) {
        this.points = [];
        this.addPoints(points);
    }

    public setWidth(width: number): void {
        this.width = width;
    }

    public setMathFunction(mathFunction: MathFunctionEnum): void {
        this.mathFunction = mathFunction;
    }
}
