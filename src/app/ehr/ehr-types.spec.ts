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
            'Tid',
            'Tidpunkt vid mätning',
            true,
          )
        ],
        [
          'systolic',
          new DataTypeQuantity(
            'Övertryck',
            'Systoliskt övertryck av blod',
            true,
            'mm[Hg]', 0, 1000,
          )
        ],
        [
          'diastolic',
          new DataTypeQuantity(
            'Undertryck',
            'Diastoliskt undertryck av blod',
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          'position',
          new DataTypeCodedText(
            'Position',
            'Position vid mätning.',
            false,
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
            'Tid',
            'Tidpunkt vid mätning',
            true,
          )
        ],
        [
          'weight',
          new DataTypeQuantity(
            'Vikt',
            'Kroppsvikt',
            true,
            'kg', 0, 1000
          )
        ],
        [
          'state_of_dress',
          new DataTypeCodedText(
            'Klädsel',
            'Klädsel vid mätning.',
            false,
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
    let bloodpressure = categories[0];
    let values: [string, any][] = [
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
    let values: [string, any][] = [
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
    test.setWidth(1);
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
    test.setMathFunction(MathFunctionEnum.TOTAL);
    test.setWidth(1);
    const res: DataPoint[] = test.getPoints();
    expect(res[0].get('weight')).toEqual(240);
  });
});
