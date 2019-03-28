import { Injectable } from '@angular/core';
import { DataPoint, CategorySpec } from '../shared/spec';
import { Platform } from './platform.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, observable, forkJoin, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import { MessageService } from '../message.service';

@Injectable({
    providedIn: 'root',
})
export class GfitService extends Platform {

    public static SESSION_STORAGE_KEY = 'accessToken';
    private user: GoogleUser;
    private dataIsFetched = false;
    private activities: any;
    private baseUrl = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/';

    // Maps Google Fit's data type names to our internal category names
    private readonly categoryDataTypeNames: Map<string, string> = new Map(
        [
            ['com.google.blood_pressure', 'blood-pressure'],
            ['com.google.weight', 'weight']
        ]
    );

    // Maps internal name for categories to the URL which is used to GET the data
    private readonly categoryUrl: Map<string, string> = new Map(
        [
            ['blood-pressure', 'raw:com.google.blood_pressure:com.google.android.apps.fitness:user_input'],
            ['weight', 'raw:com.google.weight:com.google.android.apps.fitness:user_input']
        ]

    );

    constructor(
        private googleAuth: GoogleAuthService,
        private http: HttpClient,
        private messageService: MessageService
        ) {
        super();
        this.implemented.push(
            { category: 'blood-pressure', dataTypes: ['time', 'systolic', 'diastolic'] }
        );
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
        if (!token) {
          throw new Error('no token set, authentication required');
        }
        return sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
    }

    public signIn(): void {
        this.googleAuth.getAuth()
        .subscribe((auth) => {
            auth.signIn().then(res => this.signInSuccessHandler(res));
        });
    }

    private signInSuccessHandler(res: GoogleUser) {
        this.user = res;
        sessionStorage.setItem(
            GfitService.SESSION_STORAGE_KEY, res.getAuthResponse().access_token
        );
    }

    public signOut(): void {
        this.googleAuth.getAuth()
        .subscribe(auth => {
          auth.disconnect();
        });
    }

    /**
     * This function GETs the activity metadata for the user and parses this data to
     * add categories that are available to the user. It then returns an empty observable
     * so that isAvailable() is notified when this function has finished executing and
     * the vector containing available categories has been updated.
     */
    private getActivities(): Observable<any> {
        return this.http.get(
            this.baseUrl + '?access_token=' + this.getToken()).pipe(map(res => {
                this.activities = res;
                this.activities.dataSource.forEach(source => {
                    if (source.dataStreamId.split(':')[0] === 'raw') { // As of now, we only want raw data
                        this.available.push(this.categoryDataTypeNames.get(source.dataType.name));
                        this.messageService.addMsg('Now available: ' + this.categoryDataTypeNames.get(source.dataType.name));
                    }
                });
                return EMPTY;
            }));
      }


    /**
     * This function checks if a given category is available to fetch data from
     * The first time this function is called it will GET the metadata containing information about available activites
     * @param categoryId category to check availability for
     * @returns true if category is available, false if not
     */
    // @override
    public isAvailable(categoryId: string): Observable<boolean> {
        if (!this.dataIsFetched) {
            this.dataIsFetched = true;
            return this.getActivities().pipe(map(_ =>
                 this.isImplemented(categoryId) && this.available.includes(categoryId)
                ));
        } else {
            return of(this.isImplemented(categoryId) && this.available.includes(categoryId));
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
        const weekInMs = 7 * 24 * 3600 * 1000 * 14;
        const startTime = String((Date.now() - weekInMs) * Math.pow(10, 6));
        const endTime = String(Math.floor(Date.now() * Math.pow(10, 6)));
        const dataSetId = startTime + '-' + endTime;

        let url: string = this.baseUrl;
        const tail: string = '/datasets/' +
                            dataSetId +
                            '?access_token=' +
                            this.getToken();

        if (categoryId === 'blood-pressure') {
            this.messageService.addMsg('Fetching blood pressure...');
            url += this.categoryUrl.get(categoryId) + tail;
            // Return an observable with the converted data
            return this.http.get(url).pipe(map(res => this.convertData(res, categoryId)));
        } else if (categoryId === 'weight') {
            url += this.categoryUrl.get(categoryId) + tail;
            this.messageService.addMsg('Fetching weight data...');
        } else {
            throw TypeError('unimplemented');
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
        this.messageService.addMsg('Converting data...');
        const points: DataPoint[] = [];
        if (categoryId === 'blood-pressure') {
            res.point.forEach(src => {
                points.push(new DataPoint(
                    [
                        [ 'time', new Date(src.startTimeNanos * Math.pow(10, -6)) ], // Converts ns to ms
                        [ 'systolic', src.value[0].fpVal ],
                        [ 'diastolic', src.value[1].fpVal ]
                    ]

                ));
            });
        }
        return points;
    }
}
