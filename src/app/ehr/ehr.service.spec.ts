import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { EhrService } from './ehr.service';
import { CategorySpec,
         DataTypeDateTime,
         DataTypeQuantity,
         DataType } from './datatype';
import { DataList, DataPoint } from './datalist';

describe('EhrService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      HttpClient,
      HttpHandler,
    ]
  }));

  let service: EhrService;
  let ctx;

  let bloodSpec: CategorySpec;
  let bloodList: DataList;

  let weightSpec: CategorySpec;
  let weightList: DataList;

  beforeEach(() => {
    service = TestBed.get(EhrService);
  });

  beforeAll(() => {
    ctx = {
        language: 'en',
        territory: 'SE',
    };

    bloodSpec = {
      id : 'bloood',
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
            visibleOnMobile: false,
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
              visibleOnMobile: false,
            }, 'mm[Hg]', 0, 1000,
          )
        ],
      ])
    };

    weightSpec = {
      id : 'weeight',
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
            visibleOnMobile: false,
          })
        ],
        [
          'body_weight',
          new DataTypeQuantity(
            {
              path: ['any_event'],
              label: '',
              description: '',
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: false,
            }, 'mm[Hg]', 0, 1000,
          )
        ],
      ])
    };

    bloodList = new DataList(bloodSpec);
    bloodList.addPoints([
        new DataPoint(
            [
                [ 'time', new Date(2016, 1, 1) ],
                [ 'systolic', 101 ],
            ]
        ),
        new DataPoint(
            [
                [ 'time', new Date(2016, 1, 2) ],
                [ 'systolic', 103 ],
            ]
        ),
    ]);

    weightList = new DataList(weightSpec);
    weightList.addPoints([
        new DataPoint(
            [
                [ 'time', new Date(2016, 1, 1) ],
                [ 'body_weight', 55 ],
            ]
        ),
        new DataPoint(
            [
                [ 'time', new Date(2016, 1, 2) ],
                [ 'body_weight', 95 ],
            ]
        ),
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a proper composition for bloodpressure', () => {
    expect(service.createComposition([bloodList])).toEqual({
      ctx,
      self_monitoring: {
        bloood: [
          { any_event:
            [
              {
                time: [ new Date(2016, 1, 1).toISOString() ],
                systolic: [ { '|magnitude': 101, '|unit': 'mm[Hg]' } ]
              },
              {
                time: [ new Date(2016, 1, 2).toISOString() ],
                systolic: [ { '|magnitude': 103, '|unit': 'mm[Hg]' } ]
              }
            ]
          }
        ]
      }
    });
  });

});
