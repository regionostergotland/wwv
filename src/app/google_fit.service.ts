import { DataPoint } from './shared/spec'
import { Platform } from './platform.service'

export class PlatformGoogleFit extends Platform {
    constructor() {
        this.implemented.push(
            { category: "blood-pressure", data: ["time", "systolic", "diastolic"] }
        );
    }

    // @override
    public isAvailable(categoryId: string): boolean {
        // TODO check metadata if categories has any data
        return this.isImplemented(categoryId);
    }

    public getData(category: string, dataTypes: string[],
                   start: string, end: string): DataPoint[] {
        if (category === 'blood-pressure') {
            return {
                time: ["123", "124"],
                data: [
                    { "id" : "systolic", "values" : [ 120, 140 ] },
                    { "id" : "diastolic", "values" : [ 140, 160 ] }
                ]
            }
        }
    }
}
