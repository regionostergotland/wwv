import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule,
  MatTabsModule,
  MatPaginatorModule,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
  MatTooltipModule,
  MatIconModule,
  MatDialogModule
} from '@angular/material';
import { BottomSheetCategoriesComponent,
         SidebarComponent} from './sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule,
         GoogleApiService,
         GoogleAuthService } from '../../google-fit-config';

import { HealthListItemsComponent } from '../health-list-items/health-list-items.component';
import { EditorComponent } from '../editor/editor.component';
import { ChartComponent } from '../chart/chart.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        EditorComponent,
        HealthListItemsComponent,
        BottomSheetCategoriesComponent,
        ChartComponent ],
      imports: [
        NgxChartsModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatTableModule,
        MatTabsModule,
        MatFormFieldModule,
        RouterTestingModule,
        MatCardModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatListModule,
        MatBottomSheetModule,
        MatTooltipModule,
        CustomGoogleApiModule,
        MatIconModule,
        MatDialogModule
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
