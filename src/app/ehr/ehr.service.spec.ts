import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { EhrService } from './ehr.service';

describe('EhrService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [],
        providers: [
            HttpClient,
            HttpHandler
        ]
    }));

  it('should be created', () => {
    const service: EhrService = TestBed.get(EhrService);
    expect(service).toBeTruthy();
  });

});
