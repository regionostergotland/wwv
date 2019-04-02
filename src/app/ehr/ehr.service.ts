import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CategorySpec, DataList, DataPoint,
  DataTypeEnum, DataType,
  DataTypeDateTime, DataTypeQuantity,
  DataTypeText, DataTypeCodedText } from './ehr-types';

@Injectable({
  providedIn: 'root',
})
export class EhrService {
  private readonly categories: CategorySpec[] = [
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
  ];

  private basicCredentials: string;

  constructor(
    private http: HttpClient
  ) {}

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

  private createComposition(list: DataList): string {
    const composition: any = {
      ctx: {
        language: 'en',
        territory: 'SE',
      },
      self_monitoring: {}
    };

    const spec = list.spec;
    composition.self_monitoring[spec.id] = [ {
      any_event: []
    } ];

    const event = composition.self_monitoring[spec.id][0].any_event;

    for (const point of list.getPoints()) {
      const element: any = {};

      for (const [id, value] of point.entries()) {
        element[id] = spec.dataTypes.get(id).toRest(value);
      }

      event.push(element);
    }

    const postData = JSON.stringify(composition, null, 2);
    console.log(postData);
    return JSON.stringify(composition);
  }

  public sendData(list: DataList): Observable<{}> {
    const baseUrl = 'https://rest.ehrscape.com/rest/v1/composition';
    const params = [
      ['ehrId', 'c0cf738e-67b5-4c8c-8410-f83df4082ac0'],
      ['templateId', list.spec.templateId],
      ['format', 'STRUCTURED'],
    ];
    let url = baseUrl + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }

    const composition = this.createComposition(list);

    const options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    };

    console.log(url);
    return this.http.post(url, composition, options);
  }

  public authenticateBasic(user: string, pass: string) {
    this.basicCredentials = btoa(user + ':' + pass);
  }
}
