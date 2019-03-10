import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DataPoint, CategorySpec } from './shared/spec';
import { Platform } from './platform.service';

@Injectable({
    providedIn: 'root',
})
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

    public getData(categoryId: string,
                   start: Date, end: Date): Observable<DataPoint[]> {
        if (categoryId === 'blood-pressure') {
            return of([
                new DataPoint(
                    [
                        [ "time", new Date() ],
                        [ "systolic", 10 ],
                        [ "diastolic", 20 ],
                    ]
                ),
                new DataPoint(
                    [
                        [ "time", new Date() ],
                        [ "systolic", 10 ],
                        [ "diastolic", 20 ],
                    ]
                )
            ]);
        } else {
            throw TypeError("unimplemented");
        }
    }
}
