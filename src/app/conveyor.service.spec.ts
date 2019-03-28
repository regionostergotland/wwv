import { TestBed } from '@angular/core/testing';

import { Conveyor } from './conveyor.service';
import { DataList } from './shared/spec';
import { HttpClient, HttpHandler } from '@angular/common/http';

import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG
} from 'ng-gapi';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '***REMOVED***.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read'
  ].join(' ')
};


describe('Conveyor', () => {
  beforeEach(() =>
   TestBed.configureTestingModule({
      imports: [
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        })
      ],

     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler
    ]
   }));

  it('should be created', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    expect(service).toBeTruthy();
  });

  it('should return google-fit when calling getPlatforms', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    const platforms = service.getPlatforms();
    expect(platforms).toContain('google-fit');
  });

  /*
  it('should return blood-pressure when calling getCategories', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    const cats = service.getCategories('google-fit');
    expect(cats).toContain('blood-pressure');
  });

  it('should return a list of datapoints when calling getDataList', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    service.fetchData('google-fit', 'blood-pressure', new Date(), new Date());
    const catlist: DataList = service.getDataList('blood-pressure');

    expect(catlist).toBeDefined();
  });*/

});
