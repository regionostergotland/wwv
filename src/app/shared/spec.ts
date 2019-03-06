// SPECIFICATIONS

export interface CategorySpec {
    id: string,
    label: string,
    description: string,
    dataTypes: DataType[]
}

enum DataTypeEnum {
    DV_TEXT,
    DV_CODED_TEXT,
    DV_QUANTITY
}

export interface DataType {
    id: string;
    type: DataTypeEnum;
}

export interface DataTypeText extends DataType {}

export interface DataTypeCodedTextOpt {
    id: string;
    label: string;
    description: string;
}

export interface DataTypeCodedText extends DataTypeText {
    options: DataTypeCodedTextOpt[];
}

export interface DataTypeQuantity extends DataType {
    unit: string;
    magnitude_min: number;
    magnitute_max: number;
}

// DATA STRUCTURES

    /*
export interface Category {
    point {
        dystolic: 52
        systolic: 344
        time: igår
        position: hej hej
    }

    points: point[];
}
     */

    /*
class Category {
    private spec: categorySpec;
    private points: any[];

    constructor(catSpec: CategorySpec) {
        this.spec = catSpec;
    }

    public addPoint(point: DataPoint): void {
        // validation
    }
}
     */

class DataPoint {
    private values: Map<string, any>; 
    private types: Map<string, DataType>;

    constructor(catSpec: CategorySpec, values=[]) {
        this.types = new Map<string, DataType>();
        this.values = new Map<string, any>();
        for (let i = 0; i < catSpec.dataTypes.length; i++) {
            let dataType: DataType = catSpec.dataTypes[i];
            this.types.set(dataType.id, dataType);
            this.values.set(dataType.id, null);
        }

        this.setMultiple(values);
    }

    public getValues(typeId: string): object {
        return Object.create(this.values);
    }

    private static isValid(dataType: DataType, value: any) {
        let validators: Map<DataTypeEnum, any> = new Map(
            [
                [ DataTypeEnum.DV_TEXT,         DataPoint.isValidText ],
                [ DataTypeEnum.DV_CODED_TEXT,   DataPoint.isValidCodedText ],
                [ DataTypeEnum.DV_QUANTITY ,    DataPoint.isValidQuantity ],
            ]
        );
        return validators.get(dataType.type)(dataType, value);
    }

    private static isValidText(_: DataType, value: any): boolean {
        return (typeof value === "string");
    }

    private static isValidCodedText(dataType: DataTypeCodedText,
                                    value: any): boolean {
        if (typeof value !== "string") {
            return false;
        }
        return dataType.options.some(e => e.id === value);
    }

    private static isValidQuantity(dataType: DataTypeQuantity,
                                  value: any): boolean {
        if (typeof value !== "number") {
            return false;
        }
        return dataType.magnitude_min <= value && 
                                         value <= dataType.magnitute_max;
    }

    public set(typeId: string, value: any) {
        if (!this.values.has(typeId)) {
            throw new TypeError("data type '" + typeId +
                                "' does not exist in point");
        }

        let dataType: DataType = this.types.get(typeId);
        if (!DataPoint.isValid(dataType, value)) {
            throw new TypeError("invalid value for datatype");
        }
    }

    public setMultiple(values) {
        // TODO
    }

    public getCodedTextOptions(typeId: string): DataTypeCodedTextOpt[] {
        // TODO throw exception?
        let codedTextDataType = this.types.get(typeId) as DataTypeCodedText;
        return codedTextDataType.options;
    }
}

let dystolic: DataTypeQuantity = {
    "id" : "dystolic",
    "type" : DataTypeEnum.DV_QUANTITY,
    "unit" : "mm[Hg]",
    "magnitude_min" : 0,
    "magnitute_max" : 1000,
}

let position: DataTypeCodedText = {
    "id" : "position",
    "type" : DataTypeEnum.DV_CODED_TEXT,
    "options" : [ 
        {
            "id": "standing", 
            "label": "Stående",
            "description": "notheunoehu"
        },
        {
            "id": "lying",
            "label": "Liggandes",
            "description": "soetauhnotheunoehu"
        }
    ],
}

let blood: CategorySpec = {
    "id" : "blood-pressure",
    "label" : "Blodtryck",
    "description" : "onestuhosnehunoethu",
    "dataTypes" : [ dystolic, position ]
}

let point: DataPoint = new DataPoint(blood);
point.set("dystolic", 10);
point.set("position", "standing");
