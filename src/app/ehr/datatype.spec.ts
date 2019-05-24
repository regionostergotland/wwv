import { TestBed } from '@angular/core/testing';
import { DataTypeText,
         DataTypeDateTime, DataTypeQuantity,
         DataTypeCodedText,
         MathFunctionEnum} from './datatype';

describe('datatype', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [
    ]
  }));

  /**
   * Test that valid DataTypeQuantity values pass validity check
   */
  const quantityLimited = new DataTypeQuantity(
    {
      path: ['root'],
      label: 'quantity',
      description: 'quantity limited between 10 and 100',
      required: true,
      single: false,
      visible: true,
      visibleOnMobile: false,
    }, 'mm', 10, 100
  );
  it('should not accept negative quantity value', () => {
    expect(quantityLimited.isValid(-100)).toBeFalsy();
    expect(quantityLimited.isValid(-1)).toBeFalsy();
  });
  it('should not accept below minimum quantity value', () => {
    expect(quantityLimited.isValid(9)).toBeFalsy();
    expect(quantityLimited.isValid(0)).toBeFalsy();
  });
  it('should accept minimum quantity value', () => {
    expect(quantityLimited.isValid(10)).toBeTruthy();
  });
  it('should accept between quantity value', () => {
    expect(quantityLimited.isValid(50)).toBeTruthy();
    expect(quantityLimited.isValid(11)).toBeTruthy();
    expect(quantityLimited.isValid(99)).toBeTruthy();
  });
  it('should accept maximium quantity value', () => {
    expect(quantityLimited.isValid(100)).toBeTruthy();
  });
  it('should not accept above maximium quantity value', () => {
    expect(quantityLimited.isValid(100.001)).toBeFalsy();
    expect(quantityLimited.isValid(101)).toBeFalsy();
    expect(quantityLimited.isValid(1000)).toBeFalsy();
  });
  const quantityUnlimited = new DataTypeQuantity(
    {
      path: ['root'],
      label: 'quantity',
      description: 'unlimited quantity from 0',
      required: true,
      single: false,
      visible: true,
      visibleOnMobile: false,
    }, 'mm', 0, -1
  );
  it('should not accept negative quantity value (unlimited)', () => {
    expect(quantityUnlimited.isValid(-100)).toBeFalsy();
    expect(quantityUnlimited.isValid(-1)).toBeFalsy();
    expect(quantityUnlimited.isValid(-0.01)).toBeFalsy();
  });
  it('should accept minimum quantity value (unlimited)', () => {
    expect(quantityUnlimited.isValid(0)).toBeTruthy();
  });
  it('should accept above minimum quantity value (unlimited)', () => {
    expect(quantityUnlimited.isValid(1)).toBeTruthy();
    expect(quantityUnlimited.isValid(11)).toBeTruthy();
    expect(quantityUnlimited.isValid(99)).toBeTruthy();
    expect(quantityUnlimited.isValid(9999999)).toBeTruthy();
    expect(quantityUnlimited.isValid(3298439879999999)).toBeTruthy();
  });

  /**
   * Test that DataTypeDateTime validates correctly.
   */
  const dateTime = new DataTypeDateTime({
    path: ['root'],
    label: 'datetime',
    description: '',
    required: true,
    single: false,
    visible: true,
    visibleOnMobile: false,
  });
  it('should accept valid dates', () => {
    expect(dateTime.isValid(new Date())).toBeTruthy();
    expect(dateTime.isValid(new Date(2017, 32))).toBeTruthy();
  });
  it('should not accept non-Date objects', () => {
    expect(dateTime.isValid('2019-12-11')).toBeFalsy();
    expect(dateTime.isValid('hej')).toBeFalsy();
    expect(dateTime.isValid(238947329847)).toBeFalsy();
  });

  /**
   * Test that codedText validates correctly.
   */
  const codedText = new DataTypeCodedText(
    {
      path: ['root'],
      label: 'coded',
      description: 'coded text',
      required: true,
      single: false,
      visible: true,
      visibleOnMobile: false,
    },
    [ { code: 'at1001', label: '', description: '' },
      { code: 'at1000', label: '', description: '' },
      { code: 'at1003', label: '', description: '' } ]
  );
  it('should accept valid code', () => {
    expect(codedText.isValid('at1001')).toBeTruthy();
    expect(codedText.isValid('at1000')).toBeTruthy();
    expect(codedText.isValid('at1003')).toBeTruthy();
  });
  it('should not accept invalid types for code', () => {
    expect(codedText.isValid(4)).toBeFalsy();
    expect(codedText.isValid(new Date())).toBeFalsy();
    expect(codedText.isValid(codedText)).toBeFalsy();
  });
  it('should not accept invalid code', () => {
    expect(codedText.isValid('')).toBeFalsy();
    expect(codedText.isValid('at324234')).toBeFalsy();
    expect(codedText.isValid('hejhej')).toBeFalsy();
    expect(codedText.isValid('oetnuhnsoethunstoehu')).toBeFalsy();
  });

  /**
   * Test that text validates correctly.
   */
  const text = new DataTypeText({
    path: ['root'],
    label: 'text',
    description: 'text',
    required: true,
    single: false,
    visible: true,
    visibleOnMobile: false,
  });
  it('should accept valid strings', () => {
    expect(text.isValid('at1001')).toBeTruthy();
    expect(text.isValid('at1000')).toBeTruthy();
    expect(text.isValid('at1003')).toBeTruthy();
    expect(text.isValid('oenstuhonaetuhneosahunsoethu')).toBeTruthy();
    expect(text.isValid('')).toBeTruthy();
  });
  it('should not accept non-string values', () => {
    expect(text.isValid(4)).toBeFalsy();
    expect(text.isValid(new Date())).toBeFalsy();
    expect(text.isValid(codedText)).toBeFalsy();
  });

  /**
   * Test that datatypes compares values correctly.
   */
  it('should compare datatype time values correctly', () => {
    const dataType = new DataTypeDateTime({
      path: ['any_event'],
      label: '',
      description: '',
      required: true,
      single: false,
      visible: true,
      visibleOnMobile: false,
    });
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
    const dataType = new DataTypeQuantity(
      {
        path: ['any_event'],
        label: '',
        description: '',
        required: true,
        single: false,
        visible: true,
        visibleOnMobile: false,
      }, 'unit', 0, -1);
    expect(dataType.compare(5, 100)).toBeLessThan(0);
    expect(dataType.compare(0, 0.1)).toBeLessThan(0);
    expect(dataType.compare(0.324, 0.323)).toBeGreaterThan(0);
    expect(dataType.compare(0.324, 0.324)).toBe(0);
  });
  it('should compare text datatype values correctly', () => {
    const dataType = new DataTypeText({
      path: ['root'],
      label: 'text',
      description: 'text',
      required: true,
      single: false,
      visible: true,
      visibleOnMobile: false,
    });
    expect(dataType.compare('hej', 'zzz')).toBeLessThan(0);
    expect(dataType.compare('zzzz', 'zzz')).toBeGreaterThan(0);
    expect(dataType.compare('eee', 'eee')).toBe(0);
  });
  it('should compare codedtext datatype values correctly', () => {
    const dataType = new DataTypeCodedText(
      {
        path: ['root'],
        label: 'codez',
        description: 'coded text',
        required: true,
        single: false,
        visible: true,
        visibleOnMobile: false,
      }, [
      { code: 'at1001', label: '', description: ''},
      { code: 'at1003', label: '', description: ''},
      { code: 'at1002', label: '', description: ''},
      { code: 'at1000', label: '', description: ''},
    ]);
    expect(dataType.compare('at1000', 'at1001')).toBeLessThan(0);
    expect(dataType.compare('at1003', 'at1002')).toBeGreaterThan(0);
    expect(dataType.compare('at1001', 'at1001')).toBe(0);
  });

  /*
   * Test that quantity values are truncated correctly.
   */
  it('should give median of quantities', () => {
    expect(quantityUnlimited.truncate(
      [233, 341, 128],
      MathFunctionEnum.MEDIAN)).toEqual(233);
    expect(quantityUnlimited.truncate(
      [12],
      MathFunctionEnum.MEDIAN)).toEqual(12);
    expect(quantityUnlimited.truncate(
      [0, 1],
      MathFunctionEnum.MEDIAN)).toEqual(0.5);
    expect(quantityUnlimited.truncate(
      [6, 1, 3, 34, 2, 2],
      MathFunctionEnum.MEDIAN)).toEqual(2.5);
  });
  it('should give mean of quantities', () => {
    expect(quantityUnlimited.truncate(
      [233, 341, 128],
      MathFunctionEnum.MEAN)).toEqual(234);
    expect(quantityUnlimited.truncate(
      [12],
      MathFunctionEnum.MEAN)).toEqual(12);
    expect(quantityUnlimited.truncate(
      [6, 1, 3, 34, 2, 2],
      MathFunctionEnum.MEAN)).toEqual(8);
  });
  it('should give total of quantities', () => {
    expect(quantityUnlimited.truncate(
      [233, 341, 128],
      MathFunctionEnum.TOTAL)).toEqual(702);
    expect(quantityUnlimited.truncate(
      [12],
      MathFunctionEnum.TOTAL)).toEqual(12);
    expect(quantityUnlimited.truncate(
      [6, 1, 3, 34, 2, 2],
      MathFunctionEnum.TOTAL)).toEqual(48);
  });
  it('should give minimum of quantities', () => {
    expect(quantityUnlimited.truncate(
      [233, 341, 128],
      MathFunctionEnum.MIN)).toEqual(128);
    expect(quantityUnlimited.truncate(
      [12],
      MathFunctionEnum.MIN)).toEqual(12);
    expect(quantityUnlimited.truncate(
      [6, 1, 3, 34, 2, 2],
      MathFunctionEnum.MIN)).toEqual(1);
  });
  it('should give maximum of quantities', () => {
    expect(quantityUnlimited.truncate(
      [233, 341, 128],
      MathFunctionEnum.MAX)).toEqual(341);
    expect(quantityUnlimited.truncate(
      [12],
      MathFunctionEnum.MAX)).toEqual(12);
    expect(quantityUnlimited.truncate(
      [6, 1, 3, 34, 2, 2],
      MathFunctionEnum.MAX)).toEqual(34);
  });

  /*
   * Test that text datatypes are truncated correctly.
   */
  it('should keep values if all are equal', () => {
    expect(text.truncate(
      ['hej', 'hej', 'hej'],
      MathFunctionEnum.MEAN)).toEqual('hej');
    expect(text.truncate(
      ['hej', 'hej', 'hej'],
      MathFunctionEnum.MEDIAN)).toEqual('hej');
    expect(text.truncate(
      ['haj', 'haj', 'haj'],
      MathFunctionEnum.TOTAL)).toEqual('haj');
    expect(text.truncate(
      ['hej', 'hej', 'hej'],
      MathFunctionEnum.MIN)).toEqual('hej');
    expect(text.truncate(
      ['hej', 'hej', 'hej'],
      MathFunctionEnum.MAX)).toEqual('hej');
  });
  it('should not keep values if not all are equal', () => {
    expect(text.truncate(
      ['hej', 'hoj', 'hej'],
      MathFunctionEnum.MEAN)).toEqual(undefined);
    expect(text.truncate(
      ['hej', 'hej', 'hij'],
      MathFunctionEnum.MEDIAN)).toEqual(undefined);
    expect(text.truncate(
      ['haj', '', 'haj'],
      MathFunctionEnum.TOTAL)).toEqual(undefined);
    expect(text.truncate(
      ['hej', '', 'hej'],
      MathFunctionEnum.MIN)).toEqual(undefined);
    expect(text.truncate(
      ['', 'hej', 'hej'],
      MathFunctionEnum.MAX)).toEqual(undefined);
  });
});
