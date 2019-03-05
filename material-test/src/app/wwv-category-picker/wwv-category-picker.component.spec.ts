import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WwvCategoryPickerComponent } from './wwv-category-picker.component';

describe('WwvCategoryPickerComponent', () => {
  let component: WwvCategoryPickerComponent;
  let fixture: ComponentFixture<WwvCategoryPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WwvCategoryPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WwvCategoryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
