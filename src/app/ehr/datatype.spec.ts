import { TestBed } from '@angular/core/testing';
import { DataTypeText, CategorySpec, DataType,
         DataTypeDateTime, DataTypeQuantity,
         DataTypeCodedText,
         MathFunctionEnum} from './datatype';

describe('Ehr Types', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
    ]
  }));

  const dataTypes = new Map<string, DataType>([
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
  ]);

  /**
   * Test that valid datatypes pass validity check
   */
  it('should have true validity check for correct blood_pressures', () => {
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
        expect(dataTypes.get(typeId).isValid(value)).toBeTruthy();
    }
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
});
