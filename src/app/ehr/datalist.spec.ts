import { TestBed } from '@angular/core/testing';
import { DataList, DataPoint, PeriodWidths } from './datalist';
import { CategorySpec, DataType, MathFunctionEnum,
         DataTypeDateTime,
         DataTypeQuantity,
         DataTypeCodedText } from './datatype';

describe('Ehr Types', () => {
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
        new DataTypeDateTime(
          ['any_event'],
          'Tid',
          'Tidpunkt vid mätning',
          true, false,
        )
      ],
      [
        'systolic',
        new DataTypeQuantity(
          ['any_event'],
          'Övertryck',
          'Systoliskt övertryck av blod',
          true, false,
          'mm[Hg]', 0, 1000,
        )
      ],
      [
        'diastolic',
        new DataTypeQuantity(
          ['any_event'],
          'Undertryck',
          'Diastoliskt undertryck av blod',
          true, false,
          'mm[Hg]', 0, 1000
        )
      ],
      [
        'position',
        new DataTypeCodedText(
          ['any_event'],
          'Position',
          'Position vid mätning.',
          false, false,
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
        new DataTypeDateTime(
          ['any_event'],
          'Tid',
          'Tidpunkt vid mätning',
          true, false,
        )
      ],
      [
        'weight',
        new DataTypeQuantity(
          ['any_event'],
          'Vikt',
          'Kroppsvikt',
          true, false,
          'kg', 0, 1000
        )
      ],
      [
        'state_of_dress',
        new DataTypeCodedText(
          ['any_event'],
          'Klädsel',
          'Klädsel vid mätning.',
          false, false,
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
    dataList.setInterval(1000 * 3600 * 24, MathFunctionEnum.MEAN);
    expect(dataList.getPoints().length).toEqual(3);
  });
  it('should create new datapoints with mean of the interval points numerized fields', () => {
    dataList.setInterval(1000 * 3600 * 24, MathFunctionEnum.MEAN);
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
   * Test that list contains added points.
   */
  it('should contain all added points, not contain unadded points', () => {
    const spec: CategorySpec = {
      id : 'id', label : '', description : '',
      dataTypes : new Map<string, DataType>([
        [ 'time', new DataTypeDateTime(['any_event'], '', '', true, false) ],
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

  /*
   * Test that start of period is correct and according to the locale.
   */
  fit('should be the start of the year', () => {
    let date = new Date();
    date.setFullYear(2019, 0, 1);
    date.setHours(0, 0, 0, 0);
    const startOf2019: number = date.getTime();
    expect(DataPoint.startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.YEAR)
        .getTime())
          .toBe(startOf2019);
  });
  fit('should be the start of the month', () => {
    let date = new Date();
    date.setFullYear(2019, 3, 1);
    date.setHours(0, 0, 0, 0);
    const startOfApril: number = date.getTime();
    expect(DataPoint.startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.MONTH)
        .getTime())
          .toBe(startOfApril);
  });
  fit('should be the start of the week', () => {
    let date = new Date();
    date.setFullYear(2019, 3, 8);
    date.setHours(0, 0, 0, 0);
    const startOfWeek: number = date.getTime();
    // TODO impl
    //expect(DataPoint.startOfPeriod(
    // new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.WEEK)
    //  .getTime())
    //   .toBe(startOfWeek);
  });
  fit('should be the start of the day', () => {
    let date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(0, 0, 0, 0);
    const startOfDay: number = date.getTime();
    expect(DataPoint.startOfPeriod(
      new Date(Date.parse('2019-04-11T10:34:36.844Z')), PeriodWidths.DAY)
        .getTime())
          .toBe(startOfDay);
  });
  fit('should be the start of the hour', () => {
    let date = new Date();
    date.setFullYear(2019, 3, 11);
    date.setHours(10, 0, 0, 0);
    const startOfDay: number = date.getTime();
    date.setHours(10, 49, 32, 233);
    expect(DataPoint.startOfPeriod(date, PeriodWidths.HOUR)
        .getTime())
          .toBe(startOfDay);
  });

  /**
   * Test that points compare.
   */
  it('should compare points correctly', () => {
    const dataTypes = new Map<string, DataType>([
      [ 'time', new DataTypeDateTime(['any_event'], '', '', true, false) ],
      [ 'value', new DataTypeQuantity(['any_event'], '', '', true, false,
        'unit', 0, -1) ],
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
});
