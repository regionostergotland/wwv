import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { EhrService } from '../../ehr/ehr.service';

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
  MatNativeDateModule,
  MatTooltipModule
} from '@angular/material';

import { CategorySelectionComponent } from './category-selection.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from '../../google-fit-config';


describe('CategorySelectionComponent', () => {
  let component: CategorySelectionComponent;
  let fixture: ComponentFixture<CategorySelectionComponent>;
  let ehrService: EhrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorySelectionComponent ],
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
        MatNativeDateModule,
        MatTooltipModule,
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
    fixture = TestBed.createComponent(CategorySelectionComponent);
    component = fixture.componentInstance;
    ehrService = TestBed.get(EhrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should pair categories with their correct labels', () => {
  //   expect(component.categories.length).toBeGreaterThan(0);
  //   for (const i in component.categories) {
  //     if (component.categories.hasOwnProperty(i)) {
  //       const label1: string = component.categories[i][1];
  //       const category1: string = component.categories[i][0];
  //       const label: string = ehrService.getCategorySpec(category1).label;
  //       expect(label1).toEqual(label);
  //     }
  //   }
  // });

  // it('checked box should add category to chosen', async(() => {
  //   const lengthBefore: number = component.chosenCategories.length;
  //   const checkBoxElement: HTMLElement = fixture.debugElement.query(By.css('#check-box label')).nativeElement;
  //   checkBoxElement.click();
  //   fixture.detectChanges();
  //   // number of chosen categories should increase
  //   expect(component.chosenCategories.length).toBeGreaterThan(lengthBefore);
  //   checkBoxElement.click();
  //   fixture.detectChanges();
  //   // length should go back to before
  //   expect(component.chosenCategories.length).toEqual(lengthBefore);
  // }));


});
