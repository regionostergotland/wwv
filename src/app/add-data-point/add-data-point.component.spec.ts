import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataPointComponent } from './add-data-point.component';
import { FormsModule } from '@angular/forms';

import {
  MatDatepickerModule,
  MatDialogModule,
  MatSelectModule,
  MatFormFieldModule,
  MAT_DIALOG_DATA,
  MatDialogRef
  } from '@angular/material';

import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG
} from 'ng-gapi';
import { AmazingTimePickerService } from 'amazing-time-picker';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '***REMOVED***.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read'
  ].join(' ')
};

describe('AddDataPointComponent', () => {
  let component: AddDataPointComponent;
  let fixture: ComponentFixture<AddDataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDataPointComponent ],
      imports: [
        FormsModule,

        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,

        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig
        })
      ],

     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler,

      {provide: MAT_DIALOG_DATA, useValue: {}},
      {provide: MatDialogRef, useValue: {}},
      AmazingTimePickerService

    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
