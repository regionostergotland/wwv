import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { EhrService } from './ehr.service';
import { CategorySpec,
         DataTypeDateTime,
         DataTypeQuantity,
         DataType } from './datatype';

describe('EhrService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      HttpClient,
      HttpHandler
    ]
  }));

  const spec: CategorySpec = {
    id : 'id',
    label : '',
    description : '',
    dataTypes : new Map<string, DataType>([
      [ 'time', new DataTypeDateTime(
        {
          path: ['any_event'],
          label: '',
          description: '',
          required: true,
          single: false,
          visible: true,
        })
      ],
      [
        'systolic',
        new DataTypeQuantity(
          {
            path: ['any_event'],
            label: '',
            description: '',
            required: true,
            single: false,
            visible: true,
          }, 'mm[Hg]', 0, 1000,
        )
      ],
    ])
  };

  it('should be created', () => {
    const service: EhrService = TestBed.get(EhrService);
    expect(service).toBeTruthy();
  });

});
