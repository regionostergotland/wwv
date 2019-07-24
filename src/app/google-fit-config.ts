

import {
  GoogleApiModule,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  GoogleApiService,
  GoogleAuthService,
} from 'ng-gapi';

/**
 * Defines the client id and google fit scopes
 */
const gapiClientConfig: NgGapiClientConfig = {
    client_id: '52520226417-mpajcch4ts121f3rmvnbhodeup261st5' +
               '.apps.googleusercontent.com',
    discoveryDocs: [
      'https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'
    ],
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

