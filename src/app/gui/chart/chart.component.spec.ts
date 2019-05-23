import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule,
  GoogleApiService,
  GoogleAuthService, } from '../../google-fit-config';
import { ChartComponent } from './chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      imports: [NgxChartsModule, CustomGoogleApiModule, BrowserAnimationsModule],
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
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
