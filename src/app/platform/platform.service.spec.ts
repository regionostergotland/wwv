import { TestBed } from '@angular/core/testing';

import { Platform } from './platform.service';

describe('Platform', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Map,
    ]
  }));

  it('should be created', () => {
    const service: Platform = TestBed.get(Platform);
    expect(service).toBeTruthy();
  });
});
