import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointDialogComponent } from './data-point-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatDatepickerModule,
  MatDialogModule,
  MatSelectModule,
  MatFormFieldModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatInputModule
} from '@angular/material';

import { HttpClient, HttpHandler } from '@angular/common/http';

import { AmazingTimePickerService } from 'amazing-time-picker';

import {
  GoogleApiService,
  GoogleAuthService,
} from 'ng-gapi';
import { CustomGoogleApiModule } from 'src/app/google-fit-config';

describe('AddDataPointComponent', () => {
  let component: DataPointDialogComponent;
  let fixture: ComponentFixture<DataPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPointDialogComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        CustomGoogleApiModule,
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
    fixture = TestBed.createComponent(DataPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
