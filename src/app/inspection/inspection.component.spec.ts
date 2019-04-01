import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule, MatMenuModule, MatTableModule } from '@angular/material';
import { InspectionComponent } from './inspection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InspectionComponent', () => {
  let component: InspectionComponent;
  let fixture: ComponentFixture<InspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionComponent ],
      imports: [ MatExpansionModule,
        MatMenuModule,
        MatTableModule,
        BrowserAnimationsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
