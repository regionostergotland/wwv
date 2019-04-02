import { Injectable } from '@angular/core';
import { DataPoint, CategorySpec } from '../ehr/ehr-types';
import { Platform } from './platform.service';
import { Observable, of, observable, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable({
    providedIn: 'root',
})
export class DummyPlatformService extends Platform {
    constructor() {
        super();
        this.implemented.push(
            { category: 'blood_pressure',
              dataTypes: ['time', 'systolic', 'diastolic'] },
            { category: 'body_weight',
              dataTypes: ['time', 'weight'] }
        );
    }

    public signIn(): void { }
    public signOut(): void { }

    public getAvailable(): Observable<string[]> {
        return of(this.implemented.map(e => e.category));
    }

    /**
     * This function GETs the data for a specified category and time interval.
     * The data is then converted to an internal format, and returned within an
     * observable.
     * @param categoryId category for which data is to be fetched
     * @param start start of time interval for which data is to be fetched
     * @param end end of time interval for which data is to fetched
     * @returns an observable containing data that has been converted to
     * our internal format
     */
    public getData(categoryId: string,
                   start: Date, end: Date): Observable<DataPoint[]> {
        if (categoryId === 'blood_pressure') {
            return of([
                new DataPoint(
                    [
                        [ 'time', start ],
                        [ 'systolic', 10 ],
                        [ 'diastolic', 20 ],
                    ]
                ),
                new DataPoint(
                    [
                        [ 'time', end ],
                        [ 'systolic', 11 ],
                        [ 'diastolic', 22 ],
                    ]
                )
            ]);
        } else if (categoryId === 'body_weight') {
            let points: DataPoint[] = [];
            for (let i = 0; i < 100; i++) {
                points.push(new DataPoint(
                    [
                        [ 'time', new Date() ],
                        [ 'weight', Math.random()*(500)+10 ]
                    ]
                ));
            }
            points.push(new DataPoint(
                [
                    [ 'time', start ],
                    [ 'weight', 20 ]
                ]
            ));
            points.push(new DataPoint(
                [
                    [ 'time', new Date(2017, 1) ],
                    [ 'weight', 100 ],
                ]
            ));
            points.push(new DataPoint(
                [
                    [ 'time', end ],
                    [ 'weight', 35 ],
                ]
            ));
            return of(points);
        } else {
            throw TypeError('unimplemented');
        }
    }

    public convertData(res: any, categoryId: string): DataPoint[] {
        return [];
    }
}
