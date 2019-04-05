import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EHR_CONFIG, EhrConfig } from './ehr-config';

import { CategorySpec, DataList } from './ehr-types';

@Injectable({
  providedIn: 'root',
})
export class EhrService {
  private basicCredentials: string;

  constructor(
    @Inject(EHR_CONFIG) private config: EhrConfig,
    private http: HttpClient
  ) {}

  public getCategorySpec(categoryId: string): CategorySpec {
    return this.config.categories.find(e => e.id === categoryId);
  }

  public getCategories(): string[] {
    const cats = [];

    for (const cat of this.config.categories) {
      cats.push(cat.id);
    }

    return cats;
  }

  private createComposition(lists: DataList[]): string {
    const composition: any = {
      ctx: {
        language: 'en',
        territory: 'SE',
      },
      self_monitoring: {}
    };

    for (const list of lists) {
      const spec = list.spec;
      composition.self_monitoring[spec.id] = [ {
        any_event: []
      } ];

      const event = composition.self_monitoring[spec.id][0].any_event;

      for (const point of list.getPoints()) {
        const element: any = {};

        for (const [id, value] of point.entries()) {
          if (value !== "") {
            element[id] = spec.dataTypes.get(id).toRest(value);
          }
        }

        event.push(element);
      }
    }

    const postData = JSON.stringify(composition, null, 2);
    console.log(postData);
    return JSON.stringify(composition);
  }

  public sendData(lists: DataList[]): Observable<{}> {
    // TODO get ehrId from pnr
    const params = [
      ['ehrId', 'c0cf738e-67b5-4c8c-8410-f83df4082ac0'],
      ['templateId', this.config.templateId],
      ['format', 'STRUCTURED'],
    ];
    let url = this.config.baseUrl + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }

    const composition = this.createComposition(lists);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
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
