import { Injectable } from '@angular/core';
import { DataTypeEnum } from '../ehr/datatype';
import { DataPoint } from '../ehr/datalist';
import { EhrService } from '../ehr/ehr.service';
import { Platform } from './platform.service';
import { Observable, of } from 'rxjs';

import {
  Categories,
  CommonFields,
  MedicalDevice,
  BloodPressure,
  BodyWeight,
  Height,
  HeartRate
} from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root',
})
export class DummyPlatformService extends Platform {

  constructor(
    private ehr: EhrService
  ) {
    super();
    this.implementedCategories = new Map([
      [Categories.BLOOD_PRESSURE,
      {
        url: '',
        dataTypes: new Map<string, any>([
          [CommonFields.TIME, null],
          [MedicalDevice.NAME, null],
          [BloodPressure.SYSTOLIC, null],
          [BloodPressure.DIASTOLIC, null]
        ]),
      }
      ],
      [Categories.BODY_WEIGHT,
      {
        url: '',
        dataTypes: new Map<string, any>([
          [CommonFields.TIME, null],
          [BodyWeight.WEIGHT, null],
        ]),
      }
      ],
      [Categories.HEIGHT,
      {
        url: '',
        dataTypes: new Map<string, any>([
          [CommonFields.TIME, null],
          [Height.HEIGHT, null],
        ]),
      }
      ],
      [Categories.HEART_RATE,
      {
        url: '',
        dataTypes: new Map<string, any>([
          [CommonFields.TIME, null],
          [HeartRate.RATE, null],
        ]),
      }
      ],
    ]);
  }



  public async signIn() { }
  public signOut(): void { }

  public getAvailable(): Observable<string[]> {
    return of(Array.from(this.implementedCategories.keys()));
  }

  /**
   * Generate a data point for each day within the interval for given category.
   * @param categoryId category for which data is to be fetched
   * @param start start of time interval for which data is to be fetched
   * @param end end of time interval for which data is to fetched
   * @returns an observable containing data that has been converted to
   * the internal format
   */
  public getData(categoryId: string,
                 start: Date, end: Date): Observable<DataPoint[]> {
    const generators: Map<DataTypeEnum, (date: Date) => any> = new Map([
      [DataTypeEnum.QUANTITY, date => date.getDate()],
      [DataTypeEnum.DATE_TIME, date => date],
      [DataTypeEnum.TEXT, date => date.toString()],
    ]);
    const lengthOfDay = 1000 * 3600 * 24;
    let current: Date = new
      Date(start.getTime() - start.getTime() % lengthOfDay);
    const points: DataPoint[] = [];
    while (current.getTime() < end.getTime()) {
      const fields = [];
      const fieldnames = this.implementedCategories
        .get(categoryId).dataTypes.keys();
      for (const fieldname of fieldnames) {
        const generator = generators.get(
          this.ehr.getCategorySpec(categoryId).dataTypes.get(fieldname).type);
        const value = generator(current);
        fields.push([fieldname, value]);
      }

      points.push(new DataPoint(fields));

      const nextDay: Date = new Date(current.getTime() + lengthOfDay);
      current = nextDay;
    }
    return of(points);
  }
}
