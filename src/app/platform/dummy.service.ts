import { Injectable } from '@angular/core';
import { DataPoint, CategorySpec } from '../ehr/ehr-types';
import { Platform } from './platform.service';
import { Observable, of, observable, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { MessageService } from '../message.service';

import { CategoryEnum,
         BloodPressureEnum,
         BodyWeightEnum,
         HeightEnum,
         HeartRateEnum } from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root',
})
export class DummyPlatformService extends Platform {

    constructor() {
      super(
        new Map([
          [ CategoryEnum.BLOOD_PRESSURE,
            {
              url: '',
              dataTypes: new Map([
                [BloodPressureEnum.TIME, null],
                [BloodPressureEnum.SYSTOLIC, null],
                [BloodPressureEnum.DIASTOLIC, null]
              ]),
            }
          ],
          [ CategoryEnum.BODY_WEIGHT,
            {
              url: '',
              dataTypes: new Map([
                [BodyWeightEnum.TIME, null],
                [BodyWeightEnum.WEIGHT, null],
              ]),
            }
          ],
          [ CategoryEnum.HEIGHT,
            {
              url: '',
              dataTypes: new Map([
                [HeightEnum.TIME, null],
                [HeightEnum.HEIGHT, null],
              ]),
            }
          ],
          [ CategoryEnum.HEART_RATE,
            {
              url: '',
              dataTypes: new Map([
                [HeartRateEnum.TIME, null],
                [HeartRateEnum.RATE, null],
              ]),
            }
          ],
        ])
      );
    }

  public async signIn() {}
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
    const lengthOfDay = 1000 * 3600 * 24;
    let current: Date = new
                   Date(start.getTime() - start.getTime() % lengthOfDay);
    const points: DataPoint[] = [];
    while (current.getTime() < end.getTime()) {
      const fields = [];
      const fieldnames = this.implementedCategories
        .get(categoryId).dataTypes.keys();
      for (const fieldname of fieldnames) {
        const value = fieldname === 'time' ? current : current.getDate();
        fields.push([fieldname, value]);
      }

      points.push(new DataPoint(fields));

      const nextDay: Date = new Date(current.getTime() + lengthOfDay);
      current = nextDay;
    }
    return of(points);
  }
}
