import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WwvToolbarComponent } from './wwv-toolbar.component';

describe('WwvToolbarComponent', () => {
  let component: WwvToolbarComponent;
  let fixture: ComponentFixture<WwvToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WwvToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WwvToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
