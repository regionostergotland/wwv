import { TestBed } from '@angular/core/testing';

import { GfitService } from './gfit.service';

describe('GfitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GfitService = TestBed.get(GfitService);
    expect(service).toBeTruthy();
  });
});
