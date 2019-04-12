import { TestBed } from '@angular/core/testing';
import { DataList, DataPoint } from './datalist';
import { PeriodWidths } from '../shared/period';
import { CategorySpec, DataType, MathFunctionEnum,
         DataTypeDateTime,
         DataTypeQuantity,
         DataTypeCodedText } from './datatype';

describe('datalist', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
    ]
  }));

  const bloodpressure: CategorySpec = {
    id : 'blood_pressure',
    label : 'Blodtryck',
    description : 'Mätning av arteriellt blodtryck.',
    dataTypes : new Map<string, DataType>([
      [
        'time',
        new DataTypeDateTime({
          path: ['any_event'],
          label: 'Tid',
          description: 'Tidpunkt vid mätning',
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
            label: 'Övertryck',
            description: 'Systoliskt övertryck av blod',
            required: true,
            single: false,
            visible: true,
          }, 'mm[Hg]', 0, 1000,
        )
      ],
      [
        'diastolic',
        new DataTypeQuantity(
          {
            path: ['any_event'],
            label: 'Undertryck',
            description: 'Diastoliskt undertryck av blod',
            required: true,
            single: false,
            visible: true,
          }, 'mm[Hg]', 0, 1000
        )
      ],
      [
        'position',
        new DataTypeCodedText(
          {
            path: ['any_event'],
            label: 'Position',
            description: 'Position vid mätning.',
            required: false,
            single: false,
            visible: true,
          },
          [
            {
              code: 'at1000',
              label: 'Stående',
              description: 'Stående under mätning.'
            },
            {
              code: 'at1001',
              label: 'Sittande',
              description: 'Sittande under mätning.'
            },
            {
              code: 'at1003',
              label: 'Liggande',
              description: 'Liggande under mätning.'
            }
          ]
        )
      ],
    ])
  };
  const bodyweight: CategorySpec = {
    id : 'body_weight',
    label : 'Kroppsvikt',
    description : 'Mätning av faktisk kroppsvikt.',
    dataTypes : new Map<string, DataType>([
      [
        'time',
        new DataTypeDateTime({
          path: ['any_event'],
          label: 'Tid',
          description: 'Tidpunkt vid mätning',
          required: true,
          single: false,
          visible: true,
        })
      ],
      [
        'weight',
        new DataTypeQuantity(
          {
            path: ['any_event'],
            label: 'Vikt',
            description: 'Kroppsvikt',
            required: true,
            single: false,
            visible: true,
          }, 'kg', 0, 1000
        )
      ],
      [
        'state_of_dress',
        new DataTypeCodedText(
          {
            path: ['any_event'],
            label: 'Klädsel',
            description: 'Klädsel vid mätning.',
            required: false,
            single: false,
            visible: true,
          },
          [
            {
              code: 'at0011',
              label: 'Lättklädd/underkläder',
              description: 'Klädsel som ej bidrar med vikt.'
            },
            {
              code: 'at0013',
              label: 'Naken',
              description: 'Helt utan kläder.'
            },
            {
              code: 'at0010',
              label: 'Fullklädd',
              description: 'Klädsel som bidrar med vikt.'
            }
          ]
        )
      ],
    ])
  };
  const dataList = new DataList(bloodpressure);
  dataList.addPoints([
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 1) ],
              [ 'systolic', 101 ],
              [ 'diastolic', 20 ],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 1) ],
              [ 'systolic', 103 ],
              [ 'diastolic', 22 ],
              [ 'position', 'at1003'],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 2) ],
              [ 'systolic', 100 ],
              [ 'diastolic', 20 ],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 2) ],
              [ 'systolic', 110 ],
              [ 'diastolic', 220 ],
              [ 'position', 'at1001'],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 3) ],
              [ 'systolic', 10 ],
              [ 'diastolic', 2 ],
              [ 'position', 'at1003'],
          ]
      ),
      new DataPoint(
          [
              [ 'time', new Date(2016, 1, 3) ],
              [ 'systolic', 118 ],
              [ 'diastolic', 232 ],
              [ 'position', 'at1003'],
          ]
      )
  ]);

  /*
   * Test that datalist splits datapoints into width interval
   */
  it('should split datapoints into one day intervals, producing three points', () => {
    dataList.setInterval(PeriodWidths.DAY, MathFunctionEnum.MEAN);
    expect(dataList.getPoints().length).toEqual(3);
  });
  it('should create new datapoints with mean of the interval points numerized fields', () => {
    dataList.setInterval(PeriodWidths.DAY, MathFunctionEnum.MEAN);
    expect(dataList.getPoints()[0].get('systolic')).toEqual(102);
    expect(dataList.getPoints()[0].get('diastolic')).toEqual(21);
  });
  it('should keep coded text if all values are the same', () => {
    expect(dataList.getPoints()[2].get('position')).toEqual('at1003');
  });
  it('should remove coded text if all values are not the same', () => {
    expect(dataList.getPoints()[0].get('position')).toEqual(undefined);
  });

  /**
   * Test that correct amount of intervals are created by groupByInterval
   */
  it('should create correct amount of intervals', () => {
    const points = ([
      new DataPoint([['time', new Date(2017, 1, 2)], ['value', 2]]),
      new DataPoint([['time', new Date(2017, 1, 3)], ['value', 3]]),
    ]);
    expect(DataPoint.groupByInterval(points, PeriodWidths.DAY).length)
      .toEqual(2);
  });

  /**
   * Test that list contains added points.
   */
  it('should contain all added points, not contain unadded points', () => {
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
      ])
    };
    const list = new DataList(spec);
    const addedPoints = [
      new DataPoint([['time', new Date(2017, 1)]]),
      new DataPoint([['time', new Date(2017, 4)]]),
      new DataPoint([['time', new Date(2017, 3)]]),
      new DataPoint([['time', new Date(2017, 2)]]),
      new DataPoint([['time', new Date(2017, 5)]]),
    ];
    const notAddedPoints = [
      new DataPoint([['time', new Date(2016, 1)]]),
      new DataPoint([['time', new Date(2016, 4)]]),
      new DataPoint([['time', new Date(2016, 3)]]),
      new DataPoint([['time', new Date(2016, 2)]]),
      new DataPoint([['time', new Date(2016, 5)]]),
    ];
    list.addPoints(addedPoints);
    for (const p of addedPoints) {
      expect(list.containsPoint(p)).toEqual(true);
    }
    for (const p of notAddedPoints) {
      expect(list.containsPoint(p)).toEqual(false);
    }
  });

  /**
   * Test that points compare.
   */
  it('should compare points correctly', () => {
    const dataTypes = new Map<string, DataType>([
      [ 'time', new DataTypeDateTime(
        {
          path: ['any_event'],
          label: '',
          description: '',
          required: true,
          single: false,
          visible: true,
        }
      )],
      [ 'value', new DataTypeQuantity(
        {
          path: ['any_event'],
          label: '',
          description: '',
          required: true,
          single: false,
          visible: true,
        }, 'unit', 0, -1)
      ],
    ]);
    const p1 = new DataPoint([
      ['time', new Date(2017, 1)],
      ['value', 50],
    ]);
    const p2 = new DataPoint([
      ['time', new Date(2017, 1)],
      ['value', 51],
    ]);
    const p3 = new DataPoint([
      ['time', new Date(2018, 1)],
      ['value', 50],
    ]);
    const p4 = new DataPoint([
      ['time', new Date(2018, 1)],
      ['value', 50],
    ]);

    expect(p1.compareTo(p2, dataTypes)).toBeLessThan(0);
    expect(p2.compareTo(p1, dataTypes)).toBeGreaterThan(0);
    expect(p1.compareTo(p3, dataTypes)).toBeLessThan(0);
    expect(p3.compareTo(p1, dataTypes)).toBeGreaterThan(0);
    expect(p2.compareTo(p3, dataTypes)).toBeLessThan(0);
    expect(p3.compareTo(p2, dataTypes)).toBeGreaterThan(0);
    expect(p3.compareTo(p4, dataTypes)).toBe(0);
    expect(p4.compareTo(p3, dataTypes)).toBe(0);
  });
  it('should remove unwanted points', () => {
    const spec: CategorySpec = {
      id : 'id', label : '', description : '',
      dataTypes : new Map<string, DataType>([
        [ 'time', new DataTypeDateTime(['any_event'], '', '', true, false) ],
      ])
    };
    const list = new DataList(spec);
    const keepPoints = [
      new DataPoint([['time', new Date(2017, 1)]]),
      new DataPoint([['time', new Date(2017, 4)]]),
      new DataPoint([['time', new Date(2017, 3)]]),
      new DataPoint([['time', new Date(2017, 2)]]),
      new DataPoint([['time', new Date(2017, 5)]]),
    ];
    const removePoints = [
      new DataPoint([['time', new Date(2016, 1)]]),
      new DataPoint([['time', new Date(2016, 4)]]),
      new DataPoint([['time', new Date(2016, 3)]]),
      new DataPoint([['time', new Date(2016, 2)]]),
      new DataPoint([['time', new Date(2016, 5)]]),
    ];
    list.addPoints(keepPoints);
    list.addPoints(removePoints);
    list.removePoints(removePoints);
    for (const p of keepPoints) {
      expect(list.containsPoint(p)).toEqual(true);
    }
    for (const p of removePoints) {
      expect(list.containsPoint(p)).toEqual(false);
    }
  });
});
