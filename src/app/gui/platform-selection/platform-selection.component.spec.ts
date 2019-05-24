import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material';
import { PlatformSelectionComponent } from './platform-selection.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from '../../google-fit-config';

describe('PlatformSelectionComponent', () => {
  let component: PlatformSelectionComponent;
  let fixture: ComponentFixture<PlatformSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformSelectionComponent ],
      imports: [
        RouterTestingModule,
        MatCardModule,
        CustomGoogleApiModule
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
    fixture = TestBed.createComponent(PlatformSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
