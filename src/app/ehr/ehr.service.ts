import { Injectable } from '@angular/core';

import { CategorySpec, DataList, DataPoint,
         DataTypeEnum, DataType,
         DataTypeDateTime, DataTypeQuantity,
         DataTypeText, DataTypeCodedText } from '../shared/spec';

@Injectable({
    providedIn: 'root',
})
export class EhrService {
    private readonly categories: CategorySpec[] = [
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
            id : 'body-weight',
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
                        'mm[Hg]', 0, 1000
                    )
                ],
                [
                    'comment',
                    new DataTypeText(
                        'Undertryck',
                        'Diastoliskt undertryck av blod'
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

    public getCategorySpec(categoryId: string): CategorySpec {
        return this.categories.find(e => e.id === categoryId);
    }

    public getCategories(): string[] {
        const cats = [];

        for (const cat of this.categories) {
            cats.push(cat.id);
        }

        return cats;
    }

    public sendData(list: DataList) {
        /*
        let template: any = {
            "ctx": {
                "language": "sv",
                "territory": "SE",
            },
            "self_monitor": {
                "self_monitor": []
            }
        };

        for (let i = 0; i < categories.length; i++) {
            let cat = categories[i];

            let arch: any = {};
            arch.time = cat.processed.raw.time;
            for (let j = 0; j < cat.processed.raw.data.length; j++) {
                let data = cat.processed.raw.data[j];
                arch[data.id] = data.values;
            }

            for (let j = 0; j < cat.processed.states.length; j++) {
                let state = cat.processed.states[j];
                arch[state.id] = state.input;
            }

            let template_cat: any = {};
            template_cat[cat.spec.id] = [
                { "any_event" : [ arch ] }
            ];

            template.self_monitor.self_monitor.push(template_cat);
        }

        console.log("sending:");
        console.log(JSON.stringify(template, null, 2));
         */
    }

    public authenticate() { }
}
