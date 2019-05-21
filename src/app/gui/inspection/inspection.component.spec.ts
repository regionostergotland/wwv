import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatExpansionModule,
  MatMenuModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatCardModule,
  MatSnackBarModule,
  MatSelectModule} from '@angular/material';
import { InspectionComponent } from './inspection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';

import {HealthListItemsComponent} from '../health-list-items/health-list-items.component';

import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from '../../google-fit-config';


describe('InspectionComponent', () => {
  let component: InspectionComponent;
  let fixture: ComponentFixture<InspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionComponent, HealthListItemsComponent ],
      imports: [
        MatExpansionModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSelectModule,
        MatCardModule,
        MatSnackBarModule,
        CustomGoogleApiModule
      ],
     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler,
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
