import { TestBed } from '@angular/core/testing';

import { Conveyor } from './conveyor.service';
import { DataList } from './ehr/datalist';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CustomGoogleApiModule,
         GoogleApiService,
         GoogleAuthService, } from './google-fit-config';

describe('Conveyor', () => {
  beforeEach(() =>
   TestBed.configureTestingModule({
      imports: [
        CustomGoogleApiModule
      ],

     providers: [
      GoogleAuthService,
      GoogleApiService,
      HttpClient,
      HttpHandler
    ]
   }));

  it('should be created', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    expect(service).toBeTruthy();
  });

  const checkPlatform = (platform) => {
    const service: Conveyor = TestBed.get(Conveyor);
    const platforms = service.getPlatforms();
    expect(platforms).toContain(platform);
  };

  it('should return google-fit when calling getPlatforms', () => {
    checkPlatform('google-fit');
  });

  it('should return dummy when calling getPlatforms', () => {
    checkPlatform('dummy');
  });

  it('should return a list of datapoints when calling getDataList', () => {
    const service: Conveyor = TestBed.get(Conveyor);
    service.fetchData('dummy', 'blood_pressure', new Date(), new Date());
    const catlist: DataList = service.getDataList('blood_pressure');

    expect(catlist).toBeDefined();
  });

});
