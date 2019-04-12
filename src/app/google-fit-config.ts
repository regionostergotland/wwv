

import {
  GoogleApiModule,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiService,
  GoogleAuthService,
} from 'ng-gapi';

const gapiClientConfig: NgGapiClientConfig = {
    client_id: '***REMOVED***.apps.googleusercontent.com',
    discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
    scope: [
      'https://www.googleapis.com/auth/fitness.blood_pressure.read',
      'https://www.googleapis.com/auth/fitness.body.read'
    ].join(' ')
};


const CustomGoogleApiModule = GoogleApiModule.forRoot({
  provide: NG_GAPI_CONFIG,
  useValue: gapiClientConfig
});

export { CustomGoogleApiModule, GoogleApiService, GoogleAuthService };

