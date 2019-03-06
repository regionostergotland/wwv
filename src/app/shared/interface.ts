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

export interface State {
    id: string;
    input: string; // TODO string?
}

export interface CategorySpec {
    id: string;
    data: string[];
    states: StateSpec[];
    // TODO localization / display string
}

export interface DataList {
    id: string;
    values: number[];
}

export interface RawData {
    time: string[]; // TODO datetime type?
    data: DataList[]; 
    // TODO unit?
    // TODO granularity?
}

export interface ProcessedData {
    raw: RawData;
    states: State[];
}

export interface Category {
    spec: CategorySpec,
    raw: RawData,
    processed: ProcessedData
}
