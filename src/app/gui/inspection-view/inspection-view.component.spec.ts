import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';
import {
  MatExpansionModule,
  MatMenuModule,
  MatTableModule,
  MatTabsModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatCardModule,
  MatSnackBarModule,
  MatSelectModule,
  MatIconModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import {
  CustomGoogleApiModule,
  GoogleApiService,
  GoogleAuthService,
} from '../../google-fit-config';
import { InspectionViewComponent } from './inspection-view.component';
import { DataViewerModule } from '../data-viewer/data-viewer.module';

describe('InspectionViewComponent', () => {
  let component: InspectionViewComponent;
  let fixture: ComponentFixture<InspectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InspectionViewComponent,
     ],
      imports: [
        DataViewerModule,
        MatExpansionModule,
        RouterTestingModule,
        MatMenuModule,
        MatTableModule,
        MatTabsModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSelectModule,
        MatCardModule,
        MatSnackBarModule,
        MatIconModule,
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
    fixture = TestBed.createComponent(InspectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
