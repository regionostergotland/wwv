import { InjectionToken } from '@angular/core';

import { CategorySpec, DataList, DataPoint, DataType,
         DataTypeDateTime, DataTypeQuantity, DataTypeText,
         DataTypeCodedText } from './ehr-types';

export enum CategoryEnum {
  BLOOD_PRESSURE = 'blood_pressure',
  BODY_WEIGHT = 'body_weight',
}

export enum BloodPressureEnum {
  TIME = 'time',
  SYSTOLIC = 'systolic',
  DIASTOLIC = 'diastolic',
  POSITION = 'position',
  COMMENT = 'comment',
}

export enum BodyWeightEnum {
  TIME = 'time',
  WEIGHT = 'weight',
  DRESS = 'state_of_dress',
  COMMENT = 'comment',
}

export interface EhrConfig {
  baseUrl: string;
  categories: CategorySpec[];
}

export const ehrConfig: EhrConfig = {
  baseUrl: 'https://rest.ehrscape.com/rest/v1/composition',
// TODO generate these specifications automatically from templates in ehr
  categories: [
    {
      id : CategoryEnum.BLOOD_PRESSURE,
      templateId : 'sm_blood-pressure',
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
          BloodPressureEnum.SYSTOLIC,
          new DataTypeQuantity(
            'Övertryck',
            'Systoliskt övertryck av blod',
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressureEnum.DIASTOLIC,
          new DataTypeQuantity(
            'Undertryck',
            'Diastoliskt undertryck av blod',
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressureEnum.POSITION,
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
        [
          BloodPressureEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            'Kompletterande information med fritext',
            false,
          )
        ],
      ])
    },
    {
      id : CategoryEnum.BODY_WEIGHT,
      templateId : 'sm_weight',
      label : 'Kroppsvikt',
      description : 'Mätning av faktisk kroppsvikt.',
      dataTypes : new Map<string, DataType>([
        [
          BodyWeightEnum.TIME,
          new DataTypeDateTime(
            'Tid',
            'Tidpunkt vid mätning',
            true,
          )
        ],
        [
          BodyWeightEnum.WEIGHT,
          new DataTypeQuantity(
            'Vikt',
            'Kroppsvikt',
            true,
            'kg', 0, 1000
          )
        ],
        [
          BodyWeightEnum.DRESS,
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
                label: 'Fullt påklädd',
                description: 'Klädsel som bidrar med vikt.'
              }
            ]
          )
        ],
        [
          BodyWeightEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            'Kompletterande information med fritext',
            false,
          )
        ],
      ])
    }
  ]
};

export let EHR_CONFIG = new InjectionToken<EhrConfig>('ehrconfig', {
  providedIn: 'root',
  factory: () => ehrConfig
});
