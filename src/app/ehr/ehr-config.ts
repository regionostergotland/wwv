import { InjectionToken } from "@angular/core";

import { CategorySpec, DataList, DataPoint, DataType,
         DataTypeDateTime, DataTypeQuantity, DataTypeText,
         DataTypeCodedText } from './ehr-types';

export let TEMPLATES = new InjectionToken("templates");

export interface EhrConfig {
  baseUrl: string;
  categories: CategorySpec[];
}

export const templates: EhrConfig = {
  baseUrl: 'https://rest.ehrscape.com/rest/v1/composition',
// TODO generate these specifications automatically from templates in ehr
  categories: [
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
            true,
          )
        ],
        [
          'systolic',
          new DataTypeQuantity(
            'Övertryck',
            'Systoliskt övertryck av blod',
            true,
            'mm[Hg]', 0, 1000
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
      templateId : 'sm_weight',
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
                label: 'Fullt påklädd',
                description: 'Klädsel som bidrar med vikt.'
              }
            ]
          )
        ],
        [
          'comment',
          new DataTypeText(
            'Kommentar',
            'Kompletterande information med fritext',
            false,
          )
        ],
      ])
    }
  ]
}

