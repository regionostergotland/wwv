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
      HttpHandler
    ]
  }));

  const ctx = {
      language: 'en',
      territory: 'SE',
  };

  const bloodspec: CategorySpec = {
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

  const weightspec: CategorySpec = {
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
          }, 'mm[Hg]', 0, 1000,
        )
      ],
    ])
  };

  const service: EhrService = TestBed.get(EhrService);
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const bloodlist = new DataList(bloodspec);
  bloodlist.addPoints([
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

  const weightlist = new DataList(weightspec);
  weightlist.addPoints([
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 1) ],
              [ 'systolic', 55 ],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 2) ],
              [ 'systolic', 95 ],
          ]
      ),
  ]);

  it('should create a proper composition for bloodpressure', () => {
    expect(service.createComposition([bloodlist])).toEqual({
      ctx: ctx,
      self_monitoring: {
        blooood: []
      }
    });
  });

});
