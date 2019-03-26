import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { EhrService } from '../ehr.service';

import {
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatDatepickerModule,
  MatButtonToggleModule,
  MatListModule,
  MatTableModule,
  MatButtonModule,
  MatNativeDateModule
} from '@angular/material';

import { CategoryPickerComponent } from './category-picker.component';
import { By } from '@angular/platform-browser';

describe('CategoryPickerComponent', () => {
  let component: CategoryPickerComponent;
  let fixture: ComponentFixture<CategoryPickerComponent>;
  let ehrService: EhrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryPickerComponent ],
      imports: [
        // NgModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        MatTableModule,
        MatListModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatNativeDateModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryPickerComponent);
    component = fixture.componentInstance;
    ehrService = TestBed.get(EhrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pair categories with their correct labels', () => {
    expect(component.categories.length).toBeGreaterThan(0);
    for (const i in component.categories) {
      if (component.categories.hasOwnProperty(i)) {
        const label1: string = component.categories[i][1];
        const category1: string = component.categories[i][0];
        const label: string = ehrService.getCategorySpec(category1).label;
        expect(label1).toEqual(label);
      }
    }
  });

  // it('should click change value', async(() => {
  //   fixture.detectChanges();
  //
  //   fixture.whenStable().then(() => {
  //     const inEl = fixture.debugElement.query(By.css('#cat'));
  //     expect(inEl.nativeElement.checked).toBe(false);
  //   });
  // }));

});
