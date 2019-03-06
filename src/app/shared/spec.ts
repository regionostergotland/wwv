// SPECIFICATIONS

export interface CategorySpec {
    id: string,
    label: string,
    description: string,
    dataTypes: DataType[]
}

export interface DataType {
    id: string;
}

export interface DvText extends DataType {}

export interface DvCodedTextOpt {
    id: string;
    label: string;
    description: string;
}

export interface DvCodedText extends DvText {
    options: DvCodedTextOpt[];
}

export interface DvQuantity extends DataType {
    unit: string;
    magnitude_min: number;
    magnitute_max: number;
}

// DATA STRUCTURES

export interface Category {
    point {
        dystolic: 52
        systolic: 344
        time: igår
        position: hej hej
    }

    points: point[];
}

point['dystolic'].value = 1324
point['time'].value = blabl
point['systolic'] = 1324

point['position'] = standing

class Category {
    spec;
    points: point[];

    getEmptyPoint() {
        for datatype in spec.datatypes
            point['datatype'] = null
    }

    addPoint(point) {
        // validation
    }
}

enum DataValueType {
    DV_TEXT,
    DV_CODED_TEXT,
    DV_QUANTITY
}

interface DataValue {
    valueType: DataValueType;
    value: string;
}
