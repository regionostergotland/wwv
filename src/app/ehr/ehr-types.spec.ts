import { TestBed } from '@angular/core/testing';
import { DataList, DataTypeText, DataPoint, CategorySpec, DataType,
  DataTypeDateTime, DataTypeQuantity, DataTypeCodedText } from './ehr-types';
import { HttpClient, HttpHandler} from '@angular/common/http';



describe('Ehr Types', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
   providers: [
    HttpClient,
    HttpHandler
  ]
  }));

/**
* Test case for ehr types, expecting all data points to return true for validity
* check. Detect incorrect type, outside of bounds numbers
*/

  it('should have true resluts to all valid data points', () => {
    const categories: CategorySpec[] = [
        {
            id : 'blood_pressure',
            templateId : 'sm_blood-pressure',
            label : 'Blodtryck',
            description : 'Mätning av arteriellt blodtryck.',
            dataTypes : new Map<string, DataType>([
                [
                    'time',
                    new DataTypeDateTime(
                        'Tid',
                        'Tidpunkt vid mätning',
                    )
                ],
                [
                    'systolic',
                    new DataTypeQuantity(
                        'Övertryck',
                        'Systoliskt övertryck av blod',
                        'mm[Hg]', 0, 1000
                    )
                ],
                [
                    'diastolic',
                    new DataTypeQuantity(
                        'Undertryck',
                        'Diastoliskt undertryck av blod',
                        'mm[Hg]', 0, 1000
                    )
                ],
                [
                    'position',
                    new DataTypeCodedText(
                        'Position',
                        'Position vid mätning.',
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
            templateId : 'sm_weight',
            label : 'Kroppsvikt',
            description : 'Mätning av faktisk kroppsvikt.',
            dataTypes : new Map<string, DataType>([
                [
                    'time',
                    new DataTypeDateTime(
                        'Tid',
                        'Tidpunkt vid mätning',
                    )
                ],
                [
                    'weight',
                    new DataTypeQuantity(
                        'Vikt',
                        'Kroppsvikt',
                        'kg', 0, 1000
                    )
                ],
                [
                    'state_of_dress',
                    new DataTypeCodedText(
                        'Klädsel',
                        'Klädsel vid mätning.',
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

    const data_list = new DataList(categories[0]);
    data_list.addPoints([
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
            ]
        )
    ]);
    const data_list2 = new DataList(categories[1]);
    data_list2.addPoints([
      new DataPoint(
        [
          ['time', new Date()],
          ['weight', 90],
          ['state_of_dress', 'at0011'],
        ]
      )
    ]);

    for (let point of data_list.getPoints()) {
      for (let [typeId, value] of point.entries()) {
        expect(data_list.getDataType(typeId).isValid(value)).toBeTruthy();
      }
    }
  });


});
