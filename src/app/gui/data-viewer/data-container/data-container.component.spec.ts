import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataViewerModule } from '../data-viewer.module';
import { DataContainerComponent } from './data-container.component';


describe('DataContainer', () => {
  let component: DataContainerComponent;
  let fixture: ComponentFixture<DataContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DataViewerModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
