import { DataPoint, CategorySpec } from './shared/spec'
import { Platform } from './platform.service'

export class PlatformGoogleFit extends Platform {
    constructor() {
        super();
        this.implemented.push(
            { category: "blood-pressure", dataTypes: ["time", "systolic", "diastolic"] }
        );
    }

    // @override
    public isAvailable(categoryId: string): boolean {
        // TODO check metadata if categories has any data
        return this.isImplemented(categoryId);
    }

    public getData(categorySpec: CategorySpec,
                   start: string, end: string): DataPoint[] {
        if (categorySpec.id === 'blood-pressure') {
            return [
                new DataPoint(categorySpec,
                    [
                        [ "time", new Date() ],
                        [ "systolic", 10 ],
                        [ "diastolic", 20 ],
                    ]
                ),
                new DataPoint(categorySpec,
                    [
                        [ "time", new Date() ],
                        [ "systolic", 10 ],
                        [ "diastolic", 20 ],
                    ]
                )
            ];
        } else {
            throw TypeError("unimplemented");
        }
    }
}
