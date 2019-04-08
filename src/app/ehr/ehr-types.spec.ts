import { TestBed } from '@angular/core/testing';
import { DataList, DataTypeText, DataPoint, CategorySpec, DataType,
         DataTypeDateTime, DataTypeQuantity,
         DataTypeCodedText } from './ehr-types';
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
            true,
          )
        ],
        [
          'systolic',
          new DataTypeQuantity(
            ['any_event'],
            'Övertryck',
            'Systoliskt övertryck av blod',
            true,
            'mm[Hg]', 0, 1000,
          )
        ],
        [
          'diastolic',
          new DataTypeQuantity(
            ['any_event'],
            'Undertryck',
            'Diastoliskt undertryck av blod',
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          'position',
          new DataTypeCodedText(
            ['any_event'],
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
            ['any_event'],
            'Tid',
            'Tidpunkt vid mätning',
            true,
          )
        ],
        [
          'weight',
          new DataTypeQuantity(
            ['any_event'],
            'Vikt',
            'Kroppsvikt',
            true,
            'kg', 0, 1000
          )
        ],
        [
          'state_of_dress',
          new DataTypeCodedText(
            ['any_event'],
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
    const correctBps = new DataList(categories[0]);
    correctBps.addPoints([
      new DataPoint(
        [
          [ 'time', new Date() ],
          [ 'systolic', 100 ],
          [ 'diastolic', 20 ],
        ]
      ),
      new DataPoint(
        [
          [ 'time', new Date() ],
          [ 'systolic', 11 ],
          [ 'diastolic', 22 ],
          [ 'position', 'at1003'],
        ]
      )
    ]);
    for (const point of correctBps.getPoints()) {
      for (const [typeId, value] of point.entries()) {
        expect(correctBps.getDataType(typeId).isValid(value)).toBeTruthy();
      }
    }

  });

  /**
   * Test that correct body weights pass validity check
   */
  it('should have true validity check for correct body weights', () => {
    const correctBws = new DataList(categories[1]);
    correctBws.addPoints([
      new DataPoint(
        [
          ['time', new Date()],
          ['weight', 90],
          ['state_of_dress', 'at0011'],
        ]
      ),
      new DataPoint(
        [
          ['time', new Date()],
          ['weight', 70],
        ]
      )
    ]);
    for (const point of correctBws.getPoints()) {
      for (const [typeId, value] of point.entries()) {
        expect(correctBws.getDataType(typeId).isValid(value)).toBeTruthy();
      }
    }
  });


  /**
   * Test that list contains added points.
   */
  it('should contain all added points, not contain unadded points', () => {
    const spec: CategorySpec= {
      id : 'id', label : '', description : '',
      dataTypes : new Map<string, DataType>([
        [ 'time', new DataTypeDateTime(['any_event'], '', '', true) ],
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
    for (let p of addedPoints) {
      expect(list.containsPoint(p)).toEqual(true);
    }
    for (let p of notAddedPoints) {
      expect(list.containsPoint(p)).toEqual(false);
    }
  });
});
