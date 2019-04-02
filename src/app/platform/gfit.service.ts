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

@Injectable({
    providedIn: 'root',
})
export class GfitService extends Platform {

    public static SESSION_STORAGE_KEY = 'accessToken';
    private user: GoogleUser;
    private dataIsFetched: boolean;
    private activities: any;
    private baseUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/';
    private auth: any;

    // Maps Google Fit's data type names to internal category names
    private readonly categoryDataTypeNames: Map<string, string> = new Map(
        [
            ['com.google.blood_pressure', 'blood_pressure'],
            ['com.google.weight', 'body_weight']
        ]
    );


    constructor(
      private googleAuth: GoogleAuthService,
      private http: HttpClient
      ) {
      super();
      this.initCategoryProperties();
      this.dataIsFetched = false;
      this.googleAuth.getAuth().subscribe(auth => this.auth = auth);
    }

    /**
     * Initializes the properties for all implemented categories. This includes setting the url's
     * from which data is to be fetched and specifying functions for converting data.
     */
    protected initCategoryProperties(): void {
      const bloodProps: CategoryProperties = this.implementedCategories.get('blood_pressure');
      bloodProps.url = 'raw:com.google.blood_pressure:com.google.android.apps.fitness:user_input';
      bloodProps.dataTypeConversions.set('time',
                                          src => new Date(src.startTimeNanos * Math.pow(10, -6)));
      bloodProps.dataTypeConversions.set('systolic', src => src.value[0].fpVal);
      bloodProps.dataTypeConversions.set('diastolic', src => src.value[1].fpVal);

      const weightProps: CategoryProperties = this.implementedCategories.get('body_weight');
      weightProps.url = 'raw:com.google.weight:com.google.android.apps.fitness:user_input';
      weightProps.dataTypeConversions.set('time',
                                          src => new Date(src.startTimeNanos * Math.pow(10, -6)));
      weightProps.dataTypeConversions.set('weight', src => src.value[0].fpVal);
    }


    public getToken(): string {
        const token: string = sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
        if (!token) {
          throw new Error('no token set, authentication required');
        }
        return sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
    }

    public async signIn() {
        if (!sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY) || (this.user == null)) {
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
     * This function GETs the activity metadata for the user and parses this data to
     * add categories that are available to the user.
     * @returns an observable containing an array with the available categories.
     */
    public getAvailable(): Observable<string[]> {
        if (!this.dataIsFetched) {
            this.dataIsFetched = true;
            return this.http.get(
                this.baseUrl + '?access_token=' + this.getToken()).pipe(map(res => {
                    this.activities = res;
                    this.activities.dataSource.forEach(source => {
                        if (source.dataStreamId.split(':')[0] === 'raw') { // As of now, we only want raw data
                            const categoryId: string = this.categoryDataTypeNames.get(source.dataType.name);
                            if (this.isImplemented(categoryId)) {
                                this.available.push(categoryId);
                            }
                        }
                    });
                    return this.available;
                }));
        } else {
            return of(this.available);
        }
    }

    /**
     * This function GETs the data for a specified category and time interval.
     * The data is then converted to an internal format, and returned within an observable.
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
      let url: string = this.baseUrl;
      const tail: string = '/datasets/' +
                            dataSetId +
                            '?access_token=' +
                            this.getToken();

      if (!this.isImplemented(categoryId)) {
        throw TypeError(categoryId + ' is unimplemented');
      } else {
        const categoryUrl: string = this.implementedCategories.get(categoryId).url;
        url += categoryUrl + tail;
        return this.http.get(url).pipe(map(res => this.convertData(res, categoryId)));
      }
    }

    /**
     * This function converts data from the default JSON-format which is returned
     * by Google, to our internal representation (which varies depending on category)
     * @param res result from http.get-request (json file)
     * @param categoryId specifies which category the data belongs to
     * @returns an array containing the converted DataPoint(s)
     */
    public convertData(res: any, categoryId: string): DataPoint[] {
      const points: DataPoint[] = [];
      const dataTypeConversions: Map<string, (src: any) => any> =
            this.implementedCategories.get(categoryId).dataTypeConversions;

      res.point.forEach(src => {
        const convertedData: DataPoint = new DataPoint();
        for (const [type, conversionFunc] of dataTypeConversions) {
          convertedData.set(type, conversionFunc(src));
        }
        points.push(convertedData);
      });
      return points;
    }

}
