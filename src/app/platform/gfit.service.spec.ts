import { TestBed } from '@angular/core/testing';
import { GfitService } from './gfit.service';
import { CustomGoogleApiModule,  GoogleApiService, GoogleAuthService, } from '../google-fit-config';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('GfitService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        CustomGoogleApiModule
      ],
      providers: [GoogleAuthService, GoogleApiService, HttpClient, HttpHandler]
    })
  );

  it('should be created', () => {
    const service: GfitService = TestBed.get(GfitService);
    expect(service).toBeTruthy();
  });
});
