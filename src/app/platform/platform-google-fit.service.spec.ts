import { TestBed } from '@angular/core/testing';

import { PlatformGoogleFit } from './platform-google-fit.service';

describe('PlatformGoogleFit', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlatformGoogleFit = TestBed.get(PlatformGoogleFit);
    expect(service).toBeTruthy();
  });
});
