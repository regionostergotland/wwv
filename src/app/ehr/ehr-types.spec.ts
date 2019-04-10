import { TestBed } from '@angular/core/testing';
import { DataList, DataTypeText, DataPoint, CategorySpec, DataType,
         DataTypeDateTime, DataTypeQuantity,
         DataTypeCodedText,
         MathFunctionEnum} from './ehr-types';
import { HttpClient, HttpHandler} from '@angular/common/http';

describe('Ehr Types', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
      HttpClient,
      HttpHandler
    ]
  }));

  const categories: CategorySpec[] = [
    {
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
    },
    {
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
    }
  ];

  /**
   * Test that correct blood-pressures pass validity check
   */
  it('should have true validity check for correct blood_pressures', () => {
    const bloodpressure = categories[0];
    const values: [string, any][] = [
      [ 'time', new Date(2016, 2) ],
      [ 'systolic', 100 ],
      [ 'diastolic', 20 ],
      [ 'time', new Date(2017, 1) ],
      [ 'systolic', 11 ],
      [ 'diastolic', 22 ],
      [ 'position', 'at1003'],
    ];
    for (const [typeId, value] of values) {
        expect(bloodpressure.dataTypes.get(typeId).isValid(value)).toBeTruthy();
    }
  });

  /**
   * Test that correct body weights pass validity check
   */
  it('should have true validity check for correct body weights', () => {
    const bodyweight = categories[1];
    const values: [string, any][] = [
      ['time', new Date()],
      ['weight', 90],
      ['state_of_dress', 'at0011'],
      ['time', new Date()],
      ['weight', 70],
    ];
    for (const [typeId, value] of values) {
        expect(bodyweight.dataTypes.get(typeId).isValid(value)).toBeTruthy();
    }
  });

  /*
   * Test that splits datapoints into width interval, passes if date count is
   * correct.
   */
  it('should split datapoints into one day intervals', () => {
    const test = new DataList(categories[0]);
    const date: Date = new Date();
    const date1: Date = new Date();
    const date2: Date = new Date();
    const date3: Date = new Date();
    const date4: Date = new Date();
    const date5: Date = new Date();
    date.setDate(1);
    date1.setDate(1);
    date2.setDate(2);
    date3.setDate(2);
    date4.setDate(3);
    date5.setDate(3);
    date.setHours(10);
    date1.setHours(11);
    date2.setHours(12);
    date3.setHours(13);
    date4.setHours(6);
    date5.setHours(7);
    test.addPoints([
        new DataPoint(
            [
                [ 'time', date ],
                [ 'systolic', 101 ],
                [ 'diastolic', 20 ],
            ]
        ),
        new DataPoint(
            [
                [ 'time', date1 ],
                [ 'systolic', 10 ],
                [ 'diastolic', 22 ],
                [ 'position', 'at1003'],
            ]
        ),
        new DataPoint(
            [
                [ 'time', date2 ],
                [ 'systolic', 100 ],
                [ 'diastolic', 20 ],
            ]
        ),
        new DataPoint(
            [
                [ 'time', date3 ],
                [ 'systolic', 110 ],
                [ 'diastolic', 220 ],
                [ 'position', 'at1001'],
            ]
        ),
        new DataPoint(
            [
                [ 'time', date4 ],
                [ 'systolic', 10 ],
                [ 'diastolic', 2 ],
            ]
        ),
        new DataPoint(
            [
                [ 'time', date5 ],
                [ 'systolic', 118 ],
                [ 'diastolic', 232 ],
                [ 'position', 'at1003'],
            ]
        )
    ]);
    test.setInterval(1, MathFunctionEnum.MEAN);
    expect(test.getPoints().length).toEqual(3);
  });

  it('should create new datapoints with mean of the interval points numerized fields', () => {
    const test = new DataList(categories[1]);
    const date: Date = new Date();
    const date1: Date = new Date();
    const date2: Date = new Date();
    const date3: Date = new Date();
    const date4: Date = new Date();
    const date5: Date = new Date();
    date.setDate(1);
    date1.setDate(1);
    date2.setDate(1);
    date3.setDate(2);
    date4.setDate(3);
    date5.setDate(3);
    date.setHours(2);
    date1.setHours(3);
    date2.setHours(4);
    date3.setHours(5);
    date4.setHours(6);
    date5.setHours(7);
    test.addPoints([
      new DataPoint(
        [
          ['time', date],
          ['weight', 90],
          ['state_of_dress', 'at0011'],
        ]
      ),
      new DataPoint(
        [
          ['time', date1],
          ['weight', 70],
        ]
      ),
      new DataPoint(
          [
            ['time', date2],
            ['weight', 80],
          ]
      ),
      new DataPoint(
          [
            ['time', date3],
            ['weight', 40],
          ]
      ),
      new DataPoint(
          [
            ['time', date4],
            ['weight', 80],
          ]
      ),
      new DataPoint(
          [
            ['time', date5],
            ['weight', 100],
          ]
      )
    ]);
    test.setInterval(1, MathFunctionEnum.TOTAL);
    const res: DataPoint[] = test.getPoints();
    expect(res[0].get('weight')).toEqual(240);
  });

  /**
   * Test that datatypes compares values correctly.
   */
  it('should compare datatype time values correctly', () => {
    const dataType = new DataTypeDateTime(['any_event'], '', '', true, false);
    expect(dataType.compare(new Date(2016, 1), new Date(2017, 1)))
      .toBeLessThan(0);
    expect(dataType.compare(new Date(2000, 1), new Date(2000, 2)))
      .toBeLessThan(0);
    expect(dataType.compare(new Date(2000, 4), new Date(2000, 3)))
      .toBeGreaterThan(0);
    expect(dataType.compare(new Date(2000, 2), new Date(2000, 2)))
      .toBe(0);
  });
  it('should compare quantity datatype values correctly', () => {
    const dataType = new DataTypeQuantity(['any_event'], '', '', true, false,
                                        'unit', 0, -1);
    expect(dataType.compare(5, 100)).toBeLessThan(0);
    expect(dataType.compare(0, 0.1)).toBeLessThan(0);
    expect(dataType.compare(0.324, 0.323)).toBeGreaterThan(0);
    expect(dataType.compare(0.324, 0.324)).toBe(0);
  });
  it('should compare text datatype values correctly', () => {
    const dataType = new DataTypeText(['any_event'], '', '', true, false);
    expect(dataType.compare('hej', 'zzz')).toBeLessThan(0);
    expect(dataType.compare('zzzz', 'zzz')).toBeGreaterThan(0);
    expect(dataType.compare('eee', 'eee')).toBe(0);
  });
  it('should compare codedtext datatype values correctly', () => {
    const dataType = new DataTypeCodedText(['any_event'], '', '', true, false, [
      { code: 'at1001', label: '', description: ''},
      { code: 'at1003', label: '', description: ''},
      { code: 'at1002', label: '', description: ''},
      { code: 'at1000', label: '', description: ''},
    ]);
    expect(dataType.compare('at1000', 'at1001')).toBeLessThan(0);
    expect(dataType.compare('at1003', 'at1002')).toBeGreaterThan(0);
    expect(dataType.compare('at1001', 'at1001')).toBe(0);
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
});
