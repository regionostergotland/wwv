import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import {
  MatSelectModule,
  MatFormFieldModule,
  MatCardModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule} from '@angular/material';

import { HealthListItemsComponent } from './health-list-items.component';

describe('HealthListItemsComponent', () => {
  let component: HealthListItemsComponent;
  let fixture: ComponentFixture<HealthListItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthListItemsComponent ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatSelectModule,
        MatTableModule,
        MatFormFieldModule,
        RouterTestingModule,
        MatCardModule,
        MatSidenavModule,
        MatListModule]
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
