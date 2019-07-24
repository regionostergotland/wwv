import { InjectionToken } from '@angular/core';

import { CategorySpec, DataType,
         DataTypeDateTime,
         DataTypeQuantity,
         DataTypeText,
         DataTypeCodedText } from './datatype';

export enum Categories {
  BLOOD_PRESSURE = 'blood_pressure',
  BODY_WEIGHT = 'body_weight',
  HEIGHT = 'height_length',
  HEART_RATE = 'pulse_heart_beat',
  STEPS = 'steps'
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

export enum Steps {
  STEPS = 'steps'
}

const TimeField: [string, DataType] = [
  CommonFields.TIME,
  new DataTypeDateTime({
    path: [SubTrees.EVENT],
    label: 'Tid',
    description: 'Tidpunkt vid mätning',
    required: true,
    single: false,
    visible: true,
    visibleOnMobile: true,
  })
];

const CommentField: [string, DataType] = [
  CommonFields.COMMENT,
  new DataTypeText({
    path: [SubTrees.EVENT],
    label: 'Kommentar',
    description: `Ytterligare beskrivning av mätningen som inte beskrivits i
    andra fält.`,
    required: false,
    single: false,
    visible: true,
    visibleOnMobile: false,
  })
];

const DeviceNameField: [string, DataType] = [
  MedicalDevice.NAME,
  new DataTypeText({
    path: [SubTrees.MEDICAL_DEVICE],
    label: 'Enhetsnamn',
    description: `Namn på enhet som använts för mätning.`,
    required: false,
    single: true,
    visible: false,
    visibleOnMobile: false,
  })
];

const DeviceTypeField: [string, DataType] = [
  MedicalDevice.TYPE,
  new DataTypeText({
    path: [SubTrees.MEDICAL_DEVICE],
    label: 'Enhetstyp',
    description: `Typ av enhet som använts för mätning.`,
    required: false,
    single: true,
    visible: false,
    visibleOnMobile: false,
  })
];

const DeviceManufacturerField: [string, DataType] = [
  MedicalDevice.MANUFACTURER,
  new DataTypeText({
    path: [SubTrees.MEDICAL_DEVICE],
    label: 'Enhetstillverkare',
    description: `Tillverkare av enhet som använts för mätning.`,
    required: false,
    single: true,
    visible: false,
    visibleOnMobile: false,
  })
];

export interface EhrConfig {
  /**
   * Specifications for all available categories.
   */
  categories: CategorySpec[];
}

export const ehrConfig: EhrConfig = {
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
            {
              path: [SubTrees.EVENT],
              label: 'Systoliskt',
              description: `Det högsta systemiskt arteriella blodtrycket
              uppmätt systoliskt eller under sammandragningsfasen av
              hjärtcykeln.`,
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, 'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressure.DIASTOLIC,
          new DataTypeQuantity(
            {
              path: [SubTrees.EVENT],
              label: 'Diastoliskt',
              description: `Det minsta systemiskt arteriella blodtrycket
              uppmätt diastoliskt eller i hjärtcykelns avslappningsfas.`,
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, 'mm[Hg]', 0, 1000
          )
        ],
        [
          BloodPressure.POSITION,
          new DataTypeCodedText(
            {
              path: [SubTrees.EVENT],
              label: 'Ställning',
              description: 'Individens kroppställning under mätningen.',
              required: false,
              single: false,
              visible: true,
              visibleOnMobile: false,
            }, [
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
        DeviceTypeField,
        DeviceManufacturerField,
      ])
    },
    {
      id : Categories.BODY_WEIGHT,
      label : 'Kroppsvikt',
      description : 'Mätning av en individs kroppsvikt.',
      dataTypes : new Map<string, DataType>([
        TimeField,
        [
          BodyWeight.WEIGHT,
          new DataTypeQuantity(
            {
              path: [SubTrees.EVENT],
              label: 'Vikt',
              description: 'Individens vikt.',
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, 'kg', 0, 1000
          )
        ],
        [
          BodyWeight.DRESS,
          new DataTypeCodedText(
            {
              path: [SubTrees.EVENT],
              label: 'Klädsel',
              description: `Beskrivning av individens klädsel vid tidpunkten
              för vägning.`,
              required: false,
              single: false,
              visible: true,
              visibleOnMobile: false,
            }, [
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
        CommentField,
        DeviceNameField,
        DeviceTypeField,
        DeviceManufacturerField,
      ])
    },
    {
      id : Categories.HEIGHT,
      label : 'Kroppslängd',
      description : 'Kroppslängd mäts från hjässa till fotsula.',
      dataTypes : new Map<string, DataType>([
        TimeField,
        [
          Height.HEIGHT,
          new DataTypeQuantity(
            {
              path: [SubTrees.EVENT],
              label: 'Kroppslängd',
              description: 'Kroppslängd från hjässa till fotsula.',
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, 'cm', 0, 1000
          )
        ],
        CommentField,
        DeviceNameField,
        DeviceTypeField,
        DeviceManufacturerField,
      ])
    },

    {
      id: Categories.STEPS,
      label: 'Steg',
      description: 'Antal uppmätta steg vid gång',
      dataTypes: new Map<string, DataType>(
        [
          TimeField,
          [Steps.STEPS, new DataTypeQuantity(
            {
              path: [SubTrees.EVENT],
              label: 'Antal steg',
              description: 'Antal uppnätta steg under givet tidsintervall',
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, 'Steg', 0, -1
            )],
          CommentField,
          DeviceNameField,
          DeviceTypeField,
          DeviceManufacturerField,
        ],
      )
    },


    {
      id : Categories.HEART_RATE,
      label : 'Puls/Hjärtfrekvens',
      description : `Mätning av puls eller hjärtfrekvens samt beskrivning av
      relaterade egenskaper.`,
      dataTypes : new Map<string, DataType>([
        TimeField,
        [
          HeartRate.RATE,
          new DataTypeQuantity(
            {
              path: [SubTrees.EVENT],
              label: 'Frekvens',
              description: 'Frekvensen mätt i slag per minut.',
              required: true,
              single: false,
              visible: true,
              visibleOnMobile: true,
            }, '/min', 0, -1
          )
        ],
        [
          HeartRate.POSITION,
          new DataTypeCodedText(
            {
              path: [SubTrees.EVENT],
              label: 'Kroppsställning',
              description: 'Patientens kroppsställning under observationen.',
              required: false,
              single: false,
              visible: true,
              visibleOnMobile: false,
            }, [
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
        CommentField,
        DeviceNameField,
        DeviceTypeField,
        DeviceManufacturerField,
      ])
    }
  ]
};

export let EHR_CONFIG = new InjectionToken<EhrConfig>('ehrconfig', {
  providedIn: 'root',
  factory: () => ehrConfig
});
