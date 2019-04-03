import { Injectable } from '@angular/core';
import { DataPoint, CategorySpec } from '../ehr/ehr-types';
import { Platform } from './platform.service';
import { Observable, of, observable, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { MessageService } from '../message.service';

import { CategoryEnum, BloodPressureEnum,
         BodyWeightEnum } from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root',
})
export class DummyPlatformService extends Platform {
    constructor() {
      super();
      this.implementedCategories = new Map([
        [ CategoryEnum.BLOOD_PRESSURE,
          {
            url: '',
            dataTypes: [BloodPressureEnum.TIME,
                        BloodPressureEnum.SYSTOLIC,
                        BloodPressureEnum.DIASTOLIC],
            dataTypeConversions: null,
          }
        ],
      ]);
    }

  public signIn(): void {}
  public signOut(): void {}

  public getAvailable(): Observable<string[]> {
    return of(Array.from(this.implementedCategories.keys()));
  }

  /**
   * Generate a data point for each day within the interval for given category.
   * @param categoryId category for which data is to be fetched
   * @param start start of time interval for which data is to be fetched
   * @param end end of time interval for which data is to fetched
   * @returns an observable containing data that has been converted to
   * our internal format
   */
  public getData(categoryId: string,
                 start: Date, end: Date): Observable<DataPoint[]> {
    let current: Date = start;
    let points: DataPoint[] = [];
    while (current.getTime() < end.getTime()) {
      let fields = [];
      const fieldnames = this.implementedCategories.get(categoryId).dataTypes;
      for (const fieldname of fieldnames) {
        const value = fieldname == 'time' ? current : Math.random()*1000;
        fields.push([fieldname, value]);
      }

      points.push(new DataPoint(fields));

      const nextDay: Date = new Date(current.getTime()+1000*3600*24);
      current = nextDay;
    }
    return of(points);
  }

  public convertData(res: any, categoryId: string): DataPoint[] {
    return [];
  }
}
