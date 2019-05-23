import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatTabsModule,
  MatTableModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSelectModule,
  MatPaginatorModule,
  MatDialogModule,
} from '@angular/material';

import { DataContainerComponent } from './data-container.component';
import { DataTableComponent } from '../data-table/data-table.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DataChartComponent } from '../data-chart/data-chart.component';

import { CustomGoogleApiModule,
         GoogleApiService,
         GoogleAuthService, } from 'src/app/google-fit-config';

describe('EditorComponent', () => {
  let component: DataContainerComponent;
  let fixture: ComponentFixture<DataContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatSelectModule,
        MatPaginatorModule,
        MatDialogModule,
        CustomGoogleApiModule,
      ],
      declarations: [
        DataContainerComponent,
        DataTableComponent,
        DataChartComponent
      ],
      providers: [
        GoogleApiService,
        GoogleAuthService,
        HttpClient,
        HttpHandler,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
