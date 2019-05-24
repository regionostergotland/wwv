import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {
  CustomGoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
} from 'src/app/google-fit-config';
import { DataChartComponent } from './data-chart.component';

describe('ChartComponent', () => {
  let component: DataChartComponent;
  let fixture: ComponentFixture<DataChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataChartComponent ],
      imports: [
        NgxChartsModule,
        CustomGoogleApiModule,
        BrowserAnimationsModule
      ],
      providers: [
        HttpClient,
        HttpHandler,
        GoogleAuthService,
        GoogleApiService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
