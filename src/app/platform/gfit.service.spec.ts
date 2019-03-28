import { TestBed } from '@angular/core/testing';
import { GfitService } from './gfit.service';

import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiConfig
} from 'ng-gapi';

import { HttpClient, HttpHandler } from '@angular/common/http';


const gapiClientConfig: NgGapiClientConfig = {
  client_id:
    '***REMOVED***.apps.googleusercontent.com',
  discoveryDocs: [
    'https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'
  ],
  scope: [
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read'
  ].join(' ')
};

describe('GfitService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        })
      ],

      providers: [GoogleAuthService, GoogleApiService, HttpClient, HttpHandler]
    })
  );

  it('should be created', () => {
    const service: GfitService = TestBed.get(GfitService);
    expect(service).toBeTruthy();
  });
});
