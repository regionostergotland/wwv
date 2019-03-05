import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WwvHomeComponent } from './wwv-home.component';

describe('WwvHomeComponent', () => {
  let component: WwvHomeComponent;
  let fixture: ComponentFixture<WwvHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WwvHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WwvHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
