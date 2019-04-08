import { InjectionToken } from '@angular/core';

import { CategorySpec, DataList, DataPoint, DataType,
         DataTypeDateTime, DataTypeQuantity, DataTypeText,
         DataTypeCodedText } from './ehr-types';

export enum Categories {
  BLOOD_PRESSURE = 'blood_pressure',
  BODY_WEIGHT = 'body_weight',
  HEIGHT = 'height_length',
  HEART_RATE = 'pulse_heart_beat',
}

export enum SubTrees {
  EVENT = 'any_event',
  MEDICAL_DEVICE = 'medical_device',
}

export enum CommonFields {
  TIME = 'time',
  COMMENT = 'comment',
}

export enum MedicalDevice {
  NAME = 'device_name',
  TYPE = 'type',
  MANUFACTURER = 'manufacturer',
}

export enum BloodPressure {
  SYSTOLIC = 'systolic',
  DIASTOLIC = 'diastolic',
  POSITION = 'position',
}

export enum BodyWeight {
  WEIGHT = 'weight',
  DRESS = 'state_of_dress',
}

export enum Height {
  HEIGHT = 'height_length',
}

export enum HeartRate {
  RATE = 'heart_rate',
  POSITION = 'position',
}

const TimeField: [string, DataType] = [
  CommonFields.TIME,
  new DataTypeDateTime(
    [SubTrees.EVENT],
    'Tid',
    'Tidpunkt vid mätning',
    true, false,
  )
];
const CommentField: [string, DataType] = [
  CommonFields.COMMENT,
  new DataTypeText(
    [SubTrees.EVENT],
    'Kommentar',
    `Ytterligare beskrivning av mätningen som inte beskrivits i andra
    fält.`,
    false, false,
  )
];
const DeviceNameField: [string, DataType] = [
  MedicalDevice.NAME,
  new DataTypeText(
    [SubTrees.MEDICAL_DEVICE],
    'Enhetsnamn',
    `Namn på enhet som använts för mätning.`,
    false, true,
  )
];

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
      id : Categories.BLOOD_PRESSURE,
      label : 'Blodtryck',
      description : `Den lokala mätningen av artärblodtrycket som är ett
      surrogat för artärtryck i systemcirkulationen.`,
      dataTypes : new Map<string, DataType>([
        TimeField,
        [
          BloodPressure.SYSTOLIC,
          new DataTypeQuantity(
            [SubTrees.EVENT],
            'Systoliskt',
            `Det högsta systemiskt arteriella blodtrycket uppmätt systoliskt
            eller under sammandragningsfasen av hjärtcykeln.`,
            true, false,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressure.DIASTOLIC,
          new DataTypeQuantity(
            [SubTrees.EVENT],
            'Diastoliskt',
            `Det minsta systemiskt arteriella blodtrycket uppmätt diastoliskt
            eller i hjärtcykelns avslappningsfas.`,
            true, false,
            'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressure.POSITION,
          new DataTypeCodedText(
            [SubTrees.EVENT],
            'Ställning',
            'Individens kroppställning under mätningen.',
            false, false,
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
        CommentField,
        DeviceNameField,
      ])
    },
    {
      id : Categories.BODY_WEIGHT,
      label : 'Kroppsvikt',
      description : 'Mätning av en individs kroppsvikt.',
      dataTypes : new Map<string, DataType>([
        TimeField,
        CommentField,
        [
          BodyWeight.WEIGHT,
          new DataTypeQuantity(
            [SubTrees.EVENT],
            'Vikt',
            'Individens vikt.',
            true, false,
            'kg', 0, 1000
          )
        ],
        [
          BodyWeight.DRESS,
          new DataTypeCodedText(
            [SubTrees.EVENT],
            'Klädsel',
            'Beskrivning av individens klädsel vid tidpunkten för vägning.',
            false, false,
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
      ])
    },
    {
      id : Categories.HEIGHT,
      label : 'Kroppslängd',
      description : 'Kroppslängd mäts från hjässa till fotsula.',
      dataTypes : new Map<string, DataType>([
        TimeField,
        CommentField,
        [
          Height.HEIGHT,
          new DataTypeQuantity(
            [SubTrees.EVENT],
            'Kroppslängd',
            'Kroppslängd från hjässa till fotsula.',
            true, false,
            'cm', 0, 1000
          )
        ],
      ])
    },
    {
      id : Categories.HEART_RATE,
      label : 'Puls/Hjärtfrekvens',
      description : `Mätning av puls eller hjärtfrekvens samt beskrivning av
      relaterade egenskaper.`,
      dataTypes : new Map<string, DataType>([
        TimeField,
        CommentField,
        [
          HeartRate.RATE,
          new DataTypeQuantity(
            [SubTrees.EVENT],
            'Frekvens',
            'Frekvensen mätt i slag per minut.',
            true, false,
            '/min', 0, -1
          )
        ],
        [
          HeartRate.POSITION,
          new DataTypeCodedText(
            [SubTrees.EVENT],
            'Kroppsställning',
            'Patientens kroppsställning under observationen.',
            false, false,
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
      ])
    }
  ]
};

export let EHR_CONFIG = new InjectionToken<EhrConfig>('ehrconfig', {
  providedIn: 'root',
  factory: () => ehrConfig
});
