import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexItemsComponent } from './flex-items.component';

describe('FlexItemsComponent', () => {
  let component: FlexItemsComponent;
  let fixture: ComponentFixture<FlexItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
