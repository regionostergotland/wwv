import { InjectionToken } from '@angular/core';

import { CategorySpec, DataList, DataPoint, DataType,
         DataTypeDateTime, DataTypeQuantity, DataTypeText,
         DataTypeCodedText } from './ehr-types';

export enum CategoryEnum {
  BLOOD_PRESSURE = 'blood_pressure',
  BODY_WEIGHT = 'body_weight',
  HEIGHT = 'height_length',
  HEART_RATE = 'pulse_heart_beat',
  STEPS = 'steps'
}

export enum StepEnum {
  TIME = 'time',
  STEPS = 'steps'
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

export enum HeightEnum {
  TIME = 'time',
  HEIGHT = 'height_length',
  COMMENT = 'comment',
}

export enum HeartRateEnum {
  TIME = 'time',
  RATE = 'heart_rate',
  POSITION = 'position',
  COMMENT = 'comment',
}

export interface EhrConfig {
  /**
   * Identifier used to specify category.
   */
  baseUrl: string;

  /**
   * ID for template containing archetypes for all categories of data.
   */
  templateId: string;

  /**
   * Specifications for all available categories.
   */
  categories: CategorySpec[];
}

export const ehrConfig: EhrConfig = {
  baseUrl: 'https://rest.ehrscape.com/rest/v1/composition',
  templateId : 'self-reporting',
// TODO generate these specifications automatically from templates in ehr
  categories: [
    {
      id : CategoryEnum.BLOOD_PRESSURE,
      label : 'Blodtryck',
      description : `Den lokala mätningen av artärblodtrycket som är ett
      surrogat för artärtryck i systemcirkulationen.`,
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
            'Systoliskt',
            `Det högsta systemiskt arteriella blodtrycket uppmätt systoliskt
            eller under sammandragningsfasen av hjärtcykeln.`,
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressureEnum.DIASTOLIC,
          new DataTypeQuantity(
            'Diastoliskt',
            `Det minsta systemiskt arteriella blodtrycket uppmätt diastoliskt
            eller i hjärtcykelns avslappningsfas.`,
            true,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressureEnum.POSITION,
          new DataTypeCodedText(
            'Ställning',
            'Individens kroppställning under mätningen.',
            false,
            [
              {
                code: 'at1000',
                label: 'Stående',
                description: 'Stående ställning under blodtrycksmätningen.',
              },
              {
                code: 'at1001',
                label: 'Sittande',
                description: `Sittande ställning under blodtrycksmätningen,
                exempelvis på en säng eller stol.`,
              },
              {
                code: 'at1003',
                label: 'Liggande',
                description: 'Liggande ställning under blodtrycksmätningen.',
              }
            ]
          )
        ],
        [
          BloodPressureEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            `Ytterligare beskrivning av mätningen som inte beskrivits i andra
            fält.`,
            false,
          )
        ],
      ])
    },
    {
      id : CategoryEnum.BODY_WEIGHT,
      label : 'Kroppsvikt',
      description : 'Mätning av en individs kroppsvikt.',
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
            'Individens vikt.',
            true,
            'kg', 0, 1000
          )
        ],
        [
          BodyWeightEnum.DRESS,
          new DataTypeCodedText(
            'Klädsel',
            'Beskrivning av individens klädsel vid tidpunkten för vägning.',
            false,
            [
              {
                code: 'at0011',
                label: 'Lätt klädd/underkläder',
                description: 'Kläder som inte adderar vikt avsevärt.',
              },
              {
                code: 'at0013',
                label: 'Naken',
                description: 'Inga kläder alls.',
              },
              {
                code: 'at0010',
                label: 'Fullt påklädd, inklusive skor',
                description: `Kläder, inklusive skor, som kan addera vikt
                avsevärt.`,
              }
            ]
          )
        ],
        [
          BodyWeightEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            `Ytterligare beskrivning av mätningen som inte beskrivits i andra
            fält.`,
            false,
          )
        ],
      ])
    },
    {
      id : CategoryEnum.HEIGHT,
      label : 'Kroppslängd',
      description : 'Kroppslängd mäts från hjässa till fotsula.',
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
          HeightEnum.HEIGHT,
          new DataTypeQuantity(
            'Kroppslängd',
            'Kroppslängd från hjässa till fotsula.',
            true,
            'cm', 0, 1000
          )
        ],
        [
          HeightEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            `Kommentarer avseende mätningen av kroppslängden som inte beskrivs
            i övriga fält.`,
            false,
          )
        ],
      ])
    },

    {
      id: CategoryEnum.STEPS,
      label: 'Steg',
      description: 'Antal uppmätta steg vid gång',
      dataTypes: new Map<string, DataType>(
        [
          [StepEnum.TIME, new DataTypeDateTime(
            'Tid', 'Tidpunkt vid mätning', true
          )], 
          [StepEnum.TIME, new DataTypeQuantity(
            'Antal steg',
            'Antal uppnätta steg under givet tidsintervall',
            true,
            'Steg', 0, -1
            )]
        ]
      )
    },


    {
      id : CategoryEnum.HEART_RATE,
      label : 'Puls/Hjärtfrekvens',
      description : `Mätning av puls eller hjärtfrekvens samt beskrivning av
      relaterade egenskaper.`,
      dataTypes : new Map<string, DataType>([
        [
          HeartRateEnum.TIME,
          new DataTypeDateTime(
            'Tid',
            'Tidpunkt vid mätning',
            true,
          )
        ],
        [
          HeartRateEnum.RATE,
          new DataTypeQuantity(
            'Frekvens',
            'Frekvensen mätt i slag per minut.',
            true,
            '/min', 0, -1
          )
        ],
        [
          HeartRateEnum.POSITION,
          new DataTypeCodedText(
            'Kroppsställning',
            'Patientens kroppsställning under observationen.',
            false,
            [
              {
                code: 'at1003',
                label: 'Stående eller upprätt',
                description: 'Patienten stod, gick eller sprang.',
              },
              {
                code: 'at1001',
                label: 'Sittande',
                description: `Patienten satt, exempelvis på en säng eller en
                stol.`,
              },
              {
                code: 'at1000',
                label: 'Liggande',
                description: 'Patienten låg plant.',
              }
            ]
          )
        ],
        [
          HeartRateEnum.COMMENT,
          new DataTypeText(
            'Kommentar',
            `Kommentarer avseende mätningen av kroppslängden som inte beskrivs
            i övriga fält.`,
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
