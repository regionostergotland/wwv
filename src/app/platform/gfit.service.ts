import { Injectable } from '@angular/core';
import { DataPoint, CategorySpec } from '../ehr/ehr-types';
import { Platform, CategoryProperties } from './platform.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, observable, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import { AutofillMonitor } from '@angular/cdk/text-field';
import { cat } from 'shelljs';
import { stringify } from '@angular/compiler/src/util';
import { CategoryEnum, BloodPressureEnum, BodyWeightEnum, HeightEnum, HeartRateEnum, StepEnum } from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root',
})
export class GfitService extends Platform {
  public static SESSION_STORAGE_KEY = 'accessToken';
  private available: string[] = [];
  private user: GoogleUser;
  private dataIsFetched: boolean;
  private baseUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/';
  private auth: any;

  // Step url: derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas

  // Maps Google Fit's data type names to internal category names
  private readonly categoryDataTypeNames: Map<string, string> = new Map(
    [
      ['com.google.blood_pressure', CategoryEnum.BLOOD_PRESSURE],
      ['com.google.weight', CategoryEnum.BODY_WEIGHT],
      ['com.google.heart_rate.bpm', CategoryEnum.HEART_RATE],
      ['com.google.height', CategoryEnum.HEIGHT],
      ['com.google.step_count.cumulative', CategoryEnum.STEPS]
    ]
  );

  constructor(
    private googleAuth: GoogleAuthService,
    private http: HttpClient
  ) {
    super(new Map([
      [CategoryEnum.BLOOD_PRESSURE,
      {
        url: 'raw:com.google.blood_pressure:',
        dataStreams: [],
        dataTypes: new Map(
          [
            [BloodPressureEnum.TIME,
            src => new Date(src.startTimeNanos * Math.pow(10, -6))],
            [BloodPressureEnum.SYSTOLIC, src => src.value[0].fpVal],
            [BloodPressureEnum.DIASTOLIC, src => src.value[1].fpVal],
          ]
        ),
      },
      ],
      [CategoryEnum.BODY_WEIGHT,
      {
        url: 'raw:com.google.weight:',
        dataStreams: [],
        dataTypes: new Map(
          [
            [BodyWeightEnum.TIME,
            src => new Date(src.startTimeNanos * Math.pow(10, -6))],
            [BodyWeightEnum.WEIGHT, src => src.value[0].fpVal]
          ]
        ),
      },
      ],

      [CategoryEnum.HEART_RATE,
      {
        url: 'raw:com.google.heart_rate.bpm:',
        dataStreams: [],
        dataTypes: new Map(
          [
            [HeartRateEnum.TIME,
            src => new Date(src.startTimeNanos * Math.pow(10, -6))],
          ]
        )
      },
      ],

      [CategoryEnum.HEIGHT,
      {
        url: 'raw:com.google.height:',
        dataStreams: [],
        dataTypes: new Map(
          [
            [HeightEnum.TIME,
            src => new Date(src.startTimeNanos * Math.pow(10, -6))],
            [HeightEnum.HEIGHT, src => src.value[0].fpVal]
          ]
        ),
      },
      ],

      [CategoryEnum.STEPS,
        {
          url: 'raw:com.google.step_count.cumulative:',
          dataStreams: [],
          dataTypes: new Map(
            [
              [StepEnum.TIME,
                src => new Date(src.startTimeNanos * Math.pow(10, -6))],
              [StepEnum.STEPS, src => src.value[0].fpVal]
            ]
          )
        }
      ]
    ]));

    this.dataIsFetched = false;
    this.googleAuth.getAuth().subscribe(auth => this.auth = auth);
  }

  public getToken(): string {
    const token: string = sessionStorage
      .getItem(GfitService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set, authentication required');
    }
    return sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
  }

  public async signIn() {
    if (!sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY)
      || (this.user == null)) {
      const res = await this.auth.signIn();
      this.signInSuccessHandler(res);
    }
  }

  private signInSuccessHandler(res: GoogleUser) {
    this.user = res;
    sessionStorage.setItem(
      GfitService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
    );
    console.log('access token updated');
  }

  public signOut(): void {
    this.googleAuth.getAuth()
      .subscribe(auth => {
        auth.disconnect();
      });
  }

  /**
   * This function GETs the activity metadata for the user and parses this data
   * to add categories that are available to the user.
   * @returns an observable containing an array with the available categories.
   */
  public getAvailable(): Observable<string[]> {
    const dataStreamIndex = 2;
    const devices: string[] = [];
    if (!this.dataIsFetched) {
      this.dataIsFetched = true;
      return this.http.get(
        this.baseUrl + '?access_token=' + this.getToken()).pipe(map(res => {
          const activities: any = res;
          activities.dataSource.forEach(source => {
            if (source.dataStreamId.split(':')[0] === 'raw') {
              if (source.device) {
                devices.push(source.device);
              }
              const categoryId: string = this.categoryDataTypeNames
                .get(source.dataType.name);
              if (this.isImplemented(categoryId)) {
                // Extracts the datastream of the activity
                this.implementedCategories.get(categoryId).dataStreams
                  .push(source.dataStreamId.split(':').slice(dataStreamIndex).join(':'));
                console.log('new source: ' + source.dataStreamId);
                this.available.push(categoryId);
              }
            }
          });
          console.log(this.available);
          return this.available;
        }));
    } else {
      return of(this.available);
    }
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

    const startTime = String(start.getTime() * Math.pow(10, 6));
    const endTime = String(end.getTime() * Math.pow(10, 6));
    const dataSetId = startTime + '-' + endTime;
    console.log(dataSetId);
    const tail: string = '/datasets/' +
                          dataSetId +
                          '?access_token=' +
                          this.getToken();

    if (!this.isImplemented(categoryId)) {
      throw TypeError(categoryId + ' is unimplemented');
    } else {
      const results: Observable<any>[] = [];
      const url: string = this.baseUrl + this.implementedCategories.get(categoryId).url;
      // GETs the data from each datastream
      this.implementedCategories.get(categoryId).dataStreams.forEach(dataStreamUrl => {

        results.push(this.http.get(url + dataStreamUrl + tail)
        );
      });

      return forkJoin(results).pipe(map(
        res => this.convertData(res, categoryId)));
    }
  }

  /**
   * This function converts data from the default JSON-format which is returned
   * by Google, to our internal representation (which varies depending on
   * category)
   * @param res result from http.get-request (json file)
   * @param categoryId specifies which category the data belongs to
   *  @returns an array containing the converted DataPoint(s)
   */
  protected convertData(res: any[], categoryId: string): DataPoint[] {
    const points: DataPoint[] = [];
    const dataTypeConversions: Map<string, (src: any) => any> =
      this.implementedCategories.get(categoryId).dataTypes;

    for(const response of res) {
      response.point.forEach(src => {
        const convertedData: DataPoint = new DataPoint();
        for (const [type, conversionFunc] of dataTypeConversions) {
          convertedData.set(type, conversionFunc(src));
        }
        points.push(convertedData);
      });
    }
    return points;
  }
}
