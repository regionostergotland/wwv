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

import { EditorComponent } from './editor.component';
import { HealthListItemsComponent } from '../health-list-items/health-list-items.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { CustomGoogleApiModule,
         GoogleApiService,
         GoogleAuthService, } from '../../google-fit-config';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

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
        EditorComponent,
        HealthListItemsComponent,
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
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});
