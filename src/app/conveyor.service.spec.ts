import { TestBed } from '@angular/core/testing';

import { Conveyor } from './conveyor.service';
import { DataList } from './shared/spec';
import { GoogleAuthService } from 'ng-gapi';

describe('Conveyor', () => {
  beforeEach(() =>
   TestBed.configureTestingModule({
     providers: [
       GoogleAuthService
     ]
   }));

  it('should be created', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    expect(service).toBeTruthy();
  });

  it('should return google-fit when calling getPlatforms', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    const platforms = service.getPlatforms();
    expect(platforms).toContain('google-fit');
  });

  it('should return blood-pressure when calling getCategories', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    const cats = service.getCategories('google-fit');
    expect(cats).toContain('blood-pressure');
  });

  it('should return a list of datapoints when calling getDataList', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    service.fetchData('google-fit', 'blood-pressure', new Date(), new Date());
    const catlist: DataList = service.getDataList('blood-pressure');

    expect(catlist).toBeDefined();
  });

});
