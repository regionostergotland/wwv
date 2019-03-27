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

    public static SESSION_STORAGE_KEY: string = 'accessToken';
    private user: GoogleUser;
    private dataIsFetched: boolean = false;  
    private activities: any;
    private baseUrl = "https://www.googleapis.com/fitness/v1/users/me/dataSources/";
    private readonly urlToId: Map<string, string> = new Map(
        [
            ["com.google.blood_pressure", "blood-pressure"],
            ["com.google.weight", "weight"]
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
        let token: string = sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
        if(!token) {
          throw new Error("no token set, authentication required");
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
          auth.disconnect()
        })
    }

    /**
     * This function GETs the activity metadata for the user,
     * and checks which categories are available to the user
     */
    private getActivities(): Observable<any> {
        return this.http.get(
            this.baseUrl + "?access_token=" + this.getToken()).pipe(map(res => { 
                this.activities = res; 
                this.activities.dataSource.forEach(source => { 
                    if (source.dataStreamId.split(":")[0] === "raw") { //As of now, we only want raw data
                        this.available.push(this.urlToId.get(source.dataType.name));
                        this.messageService.addMsg("Now available: " + this.urlToId.get(source.dataType.name));
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
        // TODO check metadata if categories has any data
        if(!this.dataIsFetched){
            return this.getActivities().pipe(map(_ => {
                 return this.isImplemented(categoryId) && this.available.includes(categoryId)
                }));
        }
        else
            return of(this.isImplemented(categoryId) && this.available.includes(categoryId));
    }

    public getData(categoryId: string,
                   start: Date, end: Date): Observable<DataPoint[]> { 
        const weekInMs = 7 * 24 * 3600 * 1000 * 14; 
        const startTime = String((Date.now() - weekInMs) * Math.pow(10, 6));
        const endTime = String(Math.floor(Date.now() * Math.pow(10, 6)));
        const dataSetId = startTime + "-" + endTime;
        let tail: string = "/datasets/" +
                            dataSetId +
                            "?access_token=" +
                            this.getToken();

        if (categoryId === 'blood-pressure') {
            this.messageService.addMsg("Fetching blood pressure...");
            let bloodUrl = this.baseUrl + "raw:com.google.blood_pressure:com.google.android.apps.fitness:user_input" + tail;
            //Return an observable with the converted data
            return this.http.get(bloodUrl).pipe(map(res => { return this.convertData(res, categoryId) } ));
        } 
        else if(categoryId === 'weight') {
            this.messageService.addMsg("Fetching weight data...");
        }
        
        else {
            throw TypeError('unimplemented');
        }
    }

    public convertData(res: any, categoryId: string): DataPoint[] {
        this.messageService.addMsg("Converting data...");
        let points: DataPoint[] = [];
        if(categoryId === 'blood-pressure') {
            res.point.forEach(src => {
                points.push(new DataPoint( 
                    [
                        [ 'time', new Date(src.startTimeNanos * Math.pow(10, -6)) ], // Converts ns to ms
                        [ 'systolic', src.value[0].fpVal ],
                        [ 'diastolic', src.value[1].fpVal ]
                    ]

                ))    
            });
        }
        return points;
    }
}
