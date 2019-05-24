import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPointDialogComponent } from './data-point-dialog.component';
import { DataViewerModule } from '../data-viewer.module';


describe('DataPointDialog', () => {
  let component: DataPointDialogComponent;
  let fixture: ComponentFixture<DataPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DataViewerModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
