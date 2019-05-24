import { Injectable } from '@angular/core';
import { DataPoint } from '../ehr/datalist';
import { Platform } from './platform.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleAuthService } from 'ng-gapi';
import GoogleUser = gapi.auth2.GoogleUser;
import { Categories,
         CommonFields,
         BloodPressure,
         BodyWeight,
         Height,
         HeartRate,
         Steps,
         MedicalDevice} from '../ehr/ehr-config';

@Injectable({
  providedIn: 'root',
})
export class GfitService extends Platform {
  public static SESSION_STORAGE_KEY = 'accessToken';
  private available: string[];
  private user: GoogleUser;
  private dataIsFetched: boolean;
  private baseUrl =
    'https://www.googleapis.com/fitness/v1/users/me/dataSources/';
  private auth: any;
  private devices: Set<any>;

  /* Maps common fields such as medical device and timestamp to a function that
   * extracts this data from the Google Fit JSON-response */
  private readonly commonDataTypes = new Map<string, (src: any) => any>(
    [
      [CommonFields.TIME,
      src => new Date(src.startTimeNanos * Math.pow(10, -6))],
      // split(':')[4] will yield the device uid from google's data
      // [0] is device name, [1] is device type, [2] is device manufacturer
      [MedicalDevice.NAME, src =>
        this.getDeviceInfo(src.originDataSourceId.split(':')[4])[0]],
      [MedicalDevice.TYPE, src =>
        this.getDeviceInfo(src.originDataSourceId.split(':')[4])[1]],
      [MedicalDevice.MANUFACTURER, src =>
        this.getDeviceInfo(src.originDataSourceId.split(':')[4])[2]]
    ]
  );

  // Maps Google Fit's data type names to internal category names
  private readonly categoryDataTypeNames: Map<string, string> = new Map(
    [
      ['com.google.blood_pressure', Categories.BLOOD_PRESSURE],
      ['com.google.weight', Categories.BODY_WEIGHT],
      ['com.google.heart_rate.bpm', Categories.HEART_RATE],
      ['com.google.height', Categories.HEIGHT],
      ['com.google.step_count.delta', Categories.STEPS]
    ]
  );

  constructor(
    private googleAuth: GoogleAuthService,
    private http: HttpClient
    ) {
    super();
    /* Maps all implemented categories to their datastream url and functions
     * that extract data of interest from the Google Fit JSON-response */
    const deriveUrl = 'derived:com.google.';
    this.implementedCategories = new Map([
      [Categories.BLOOD_PRESSURE, {
        url: deriveUrl +
             'blood_pressure:com.google.android.gms:merged',
        dataTypes: new Map<string, any>(
          Array.from(this.commonDataTypes.entries()))
          .set(BloodPressure.SYSTOLIC, src => src.value[0].fpVal)
          .set(BloodPressure.DIASTOLIC, src => src.value[1].fpVal)
      }],
      [Categories.BODY_WEIGHT, {
        url: deriveUrl +
             'weight:com.google.android.gms:merge_weight',
        dataTypes: new Map<string, any>(
          Array.from(this.commonDataTypes.entries()))
          .set(BodyWeight.WEIGHT, src => src.value[0].fpVal)
      }],
      [Categories.HEART_RATE, {
        url: deriveUrl +
             'heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
        dataTypes: new Map<string, any>(
          Array.from(this.commonDataTypes.entries()))
          .set(HeartRate.RATE, src => src.value[0].fpVal)
      }],
      [Categories.HEIGHT, {
        url: deriveUrl +
             'height:com.google.android.gms:merge_height',
        dataTypes: new Map<string, any>(
          Array.from(this.commonDataTypes.entries()))
          .set(Height.HEIGHT, src => src.value[0].fpVal * 100)
      }],
      [Categories.STEPS, {
        url: deriveUrl +
             'step_count.delta:com.google.android.gms:merge_step_deltas',
        dataTypes: new Map<string, any>(
          Array.from(this.commonDataTypes.entries()))
          .set(Steps.STEPS, src => src.value[0].intVal)
      }]
    ]);

    this.dataIsFetched = false;
    this.googleAuth.getAuth().subscribe(auth => this.auth = auth);
    this.available = [];
    this.devices = new Set<any>();
  }

  public getToken(): string {
    const token: string = sessionStorage
      .getItem(GfitService.SESSION_STORAGE_KEY);
    if (!token) {
      throw new Error('no token set, authentication required');
    }
    return sessionStorage.getItem(GfitService.SESSION_STORAGE_KEY);
  }

  /**
   * Attempts to authenticate a user against Google. The method has been
   * assigned the 'async' prefix in order to enable the application to fully
   * await the execution of the external process of signing in to Google.
   */
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
  }

  public signOut(): void {
    this.googleAuth.getAuth()
      .subscribe(auth => {
        auth.disconnect();
      });
  }

  /**
   * Checks if a given device is available, and returns information
   * about the device if it is. If the device is not found, this returns
   * an array of empty strings.
   * @param deviceUid unique identifier for requested device
   * @returns an array containing information about the device
   */
  private getDeviceInfo(deviceUid: string): string[] {
    const entries =  this.devices.entries();
    let res: any;
    for (const e of entries) {
      if (e[0].uid === deviceUid) {
        res = e[0];
      }
    }
    return res ? [res.model, res.type, res.manufacturer] : ['', '', ''];
  }

  /**
   * This function GETs the activity metadata for the user and parses this data
   * to add categories that are available to the user.
   * @returns an observable containing an array with the available categories.
   */
  public getAvailable(): Observable<string[]> {
    if (!this.dataIsFetched) {
      this.dataIsFetched = true;
      return this.http.get(
        this.baseUrl + '?access_token=' + this.getToken()).pipe(map(res => {
          const activities: any = res;
          activities.dataSource.forEach(source => {
            // Might want to check if last index contains the string 'merge'
            // instead?
            if (source.dataStreamId.split(':')[0] === 'derived') {
              const categoryId: string = this.categoryDataTypeNames
                .get(source.dataType.name);
              if (source.device) {
                this.devices.add(source.device);
              }
              if (this.isImplemented(categoryId) &&
                  !this.available.includes(categoryId)) {
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
    const tail: string = '/datasets/' +
                          dataSetId +
                          '?access_token=' +
                          this.getToken();

    if (!this.isImplemented(categoryId)) {
      throw TypeError(categoryId + ' is unimplemented');
    } else {
      const url: string =
        this.baseUrl + this.implementedCategories.get(categoryId).url + tail;
      return this.http.get(url).pipe(map(
        res => this.convertData(res, categoryId)));
    }
  }

  /**
   * This function converts data from the default JSON-format which is returned
   * by Google, to the internal representation (which varies depending on
   * category)
   * @param res result from http.get-request (json file)
   * @param categoryId specifies which category the data belongs to
   *  @returns an array containing the converted DataPoint(s)
   */
  protected convertData(res: any, categoryId: string): DataPoint[] {
    const points: DataPoint[] = [];
    const dataTypeConversions: Map<string, (src: any) => any> =
      this.implementedCategories.get(categoryId).dataTypes;
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
