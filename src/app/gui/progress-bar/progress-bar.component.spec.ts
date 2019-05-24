import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatGridListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRoutes, Routes, RouterModule } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { CustomGoogleApiModule,
         GoogleApiService,
         GoogleAuthService, } from '../../google-fit-config';
import { ProgressBarComponent } from './progress-bar.component';
import { Conveyor } from '../../conveyor.service';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressBarComponent ],
      imports: [ MatGridListModule,
        RouterTestingModule,
        RouterModule,
        CustomGoogleApiModule
    ],

   providers: [
    GoogleAuthService,
    GoogleApiService,
    HttpClient,
    HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
