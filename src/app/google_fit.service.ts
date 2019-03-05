import { RawData } from './shared/interface'
import { Platform } from './platform.service'

export class PlatformGoogleFit extends Platform {
    constructor() {
        super('google-fit');

        this.implemented.push(
            { category: "blood-pressure", data: ["systolic", "diastolic"] }
        );
    }

    public getData(category: string, dataTypes: string[],
                   start: string, end: string): RawData {
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
