import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDataPointComponent } from './add-data-point.component';

describe('AddDataPointComponent', () => {
  let component: AddDataPointComponent;
  let fixture: ComponentFixture<AddDataPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDataPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDataPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
