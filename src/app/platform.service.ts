import { CategorySpec, RawData } from './shared/interface'

interface Implementation {
    category: string,
    data: string[],
}

export abstract class Platform {
    readonly id: string;
    protected implemented: Implementation[] = [];

    constructor(id: string) {
        this.id = id;
    }

    public abstract getData(category: string, dataTypes: string[],
                            start: string, end: string): RawData;

    public isImplemented(catSpec: CategorySpec): boolean {
        let impl = null;
        for (let i = 0; i < this.implemented.length; i++) {
            if (this.implemented[i].category == catSpec.id) {
                impl = this.implemented[i];
                break;
            }
        }
        //let impl = this.implemented.find(e => e.category == catSpec.id);
        if (!impl) {
            return false;
        }

        for (let i = 0; i < catSpec.data.length; i++) {
            let requiredDataType = catSpec.data[i];
            let dataImplemented = false;
            for (let j = 0; j < impl.data.length; j++) {
                if (impl.data[j] == requiredDataType) {
                    dataImplemented = true;
                    break;
                }
            }
            if (!dataImplemented) {
                return false;
            }
            //if (!impl.data.includes(requiredDataType)){
            //    return false;
            //}
        }

        return true;
    }
}
