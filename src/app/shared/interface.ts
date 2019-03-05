export enum StateType {
    ENUM = "enum",
    QUANTITY = "quantity",
    TEXT = "text"
}

export interface StateSpec {
    id: string;
    input_type: StateType;
    enum_opts: string[];
}

export interface CategorySpec {
    id: string;
    data: string[];
    states: StateSpec[];
}

export interface DataList {
    id: string;
    values: number[];
}

export interface RawData {
    time: string[]; // TODO datetime type?
    data: DataList[]; 
    // TODO granularity?
}

export interface ProcessedData {
    time: string[];
    data: DataList[];
    states;
}

export interface Category {
    spec: CategorySpec,
    raw: RawData,
    processed: ProcessedData
}
