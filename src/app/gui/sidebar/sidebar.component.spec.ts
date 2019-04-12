import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
  MatTooltipModule,
  MatIconModule
} from '@angular/material';
import {BottomSheetCategoriesComponent, SidebarComponent} from './sidebar.component';
import { HealthListItemsComponent } from '../health-list-items/health-list-items.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule, GoogleApiService, GoogleAuthService } from '../../google-fit-config';


describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent, HealthListItemsComponent, BottomSheetCategoriesComponent ],
      imports: [
        BrowserAnimationsModule,
        MatSelectModule,
        MatTableModule,
        MatFormFieldModule,
        RouterTestingModule,
        MatCardModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatListModule,
        MatBottomSheetModule,
        MatTooltipModule,
        CustomGoogleApiModule,
        MatIconModule
      ],

     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler,
       {provide: MatBottomSheetRef, useValue: {}},
       {provide: MAT_BOTTOM_SHEET_DATA, useValue: {}},
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
