import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatTabsModule,
  MatTableModule,
  MatDialogModule,
  MatDialogRef,
  MatCheckboxModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatIconModule
} from '@angular/material';

import { DataTableComponent } from './data-table.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from 'src/app/google-fit-config';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatFormFieldModule,
        RouterTestingModule,
        MatCardModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatListModule,
        MatDialogModule,
        MatTooltipModule,
        MatPaginatorModule,
        CustomGoogleApiModule,
        MatIconModule
      ],

     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler,
      {provide: MatDialogRef, useValue: {}}
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
