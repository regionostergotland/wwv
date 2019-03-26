import { TestBed } from '@angular/core/testing';

import { Conveyor } from './conveyor.service';

describe('Conveyor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    expect(service).toBeTruthy();
  });


  /*tests to write*/
  /* getPlatforms returns google fit */
  /* getCategories returns blood pressure and steps */
  /* fetchData leaves data in platform? */
  /* getDataList returns a list from categoryId */
  /* setDataList adds new datalist correctly */
  /* sendData calls on ehrService correctly */
  
});
