import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EHR_CONFIG, EhrConfig } from './ehr-config';

import { CategorySpec } from './datatype';
import { DataList } from './datalist';

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

  private createUrl(baseUrl: string, params): string{
    let url = baseUrl + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }
    return url;
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

      composition.self_monitoring[spec.id] = [ {} ];
      const root = composition.self_monitoring[spec.id];

      for (let p = 0; p < list.getPoints().length; p++) {
        const point = list.getPoints()[p];
        for (const [id, value] of point.entries()) {
          const dataType = spec.dataTypes.get(id);
          if (value !== '') {
            let container: any = root;
            for (const key of dataType.path) {
              if (!(key in container[0])) {
                container[0][key] = [ {} ];
              }
              container = container[0][key];
            }
            let element: any;
            if (dataType.single) { // use/overwrite first and only element
              if (!container[0]) {
                container[0] = {};
              }
              element = container[0];
            } else {
              if (!container[p]) {
                container[p] = {};
              }
              element = container[p];
            }
            element[id] = dataType.toRest(value);
          }
        }
      }
    }

    // TODO remove below later
    const postData = JSON.stringify(composition, null, 2);
    console.log(postData);
    return JSON.stringify(composition);
  }

  private getEhrId(pnr: string): Observable<{}> {
    let url = this.config.baseUrl + 'demographics/party/query'

    console.log(pnr);
    const params = [
      ['personnummer', pnr],
    ];

    const options = {
      headers: new HttpHeaders({
        //'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    }
    
    const query = [
      { 
        "key": "personnummer",
        "value": pnr
      }
    ]

    return this.http.post(url, query, options);
  }

  public sendData(pnr: string, lists: DataList[]): Observable<{}> {
    let url = this.config.baseUrl + '/composition'
    // TODO get ehrId from pnr
    const params = [
      ['ehrId', 'c0cf738e-67b5-4c8c-8410-f83df4082ac0'],
      ['templateId', this.config.templateId],
      ['format', 'STRUCTURED'],
    ];

    const composition = this.createComposition(lists);

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    }

    return this.getEhrId(pnr);
    //return this.http.post(this.createUrl(url, params), composition, options);
  }

  public authenticateBasic(user: string, pass: string) {
    this.basicCredentials = btoa(user + ':' + pass);
  }
}
