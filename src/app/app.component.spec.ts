import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessagesComponent } from './messages/messages.component';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material';
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

// describe what is being tested
// describe(xComponent)
describe('AppComponent', () => {
  // The purpose of the async is to let all the possible asynchronous code to finish before continuing.
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ // add all modules used in this component
        RouterTestingModule,
        MatToolbarModule,
        RouterTestingModule,
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        })
      ],
      declarations: [ // add all components used in this component
        AppComponent,
        ToolbarComponent,
        AppComponent,
        MessagesComponent
      ],
      providers: [
        GoogleAuthService,
        GoogleApiService,
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();
  }));

  // describe the test to be executed
  // it( should  do this/be that)
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    // verifies if the test is true or false
    expect(app).toBeTruthy();
  });

  it(`should have as title 'wwv'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('wwv');
  });

  it('should render the app toolbar', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const compiled = fixture.debugElement.nativeElement;
  // gets the native element of the compiled HTML
  expect(compiled.querySelector('app-toolbar')).toBeTruthy();
  });

});
