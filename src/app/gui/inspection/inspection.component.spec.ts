import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatExpansionModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatSelectModule} from '@angular/material';
import { InspectionComponent } from './inspection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  GoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG
} from 'ng-gapi';
import {HealthListItemsComponent} from '../health-list-items/health-list-items.component';

const gapiClientConfig: NgGapiClientConfig = {
  client_id: '***REMOVED***.apps.googleusercontent.com',
  discoveryDocs: ['https://analyticsreporting.googleapis.com/$discovery/rest?version=v4'],
  scope: [
    'https://www.googleapis.com/auth/fitness.blood_pressure.read',
    'https://www.googleapis.com/auth/fitness.body.read'
  ].join(' ')
};

describe('InspectionComponent', () => {
  let component: InspectionComponent;
  let fixture: ComponentFixture<InspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionComponent, HealthListItemsComponent ],
      imports: [ MatExpansionModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatTooltipModule,
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
      HttpHandler
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
