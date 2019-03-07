import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthListItemsComponent } from './health-list-items.component';

describe('HealthListItemsComponent', () => {
  let component: HealthListItemsComponent;
  let fixture: ComponentFixture<HealthListItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthListItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
