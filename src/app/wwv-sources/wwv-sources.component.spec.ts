import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WwvSourcesComponent } from './wwv-sources.component';

describe('WwvSourcesComponent', () => {
  let component: WwvSourcesComponent;
  let fixture: ComponentFixture<WwvSourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WwvSourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WwvSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
