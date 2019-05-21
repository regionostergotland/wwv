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

  /**
   * Creates a JSON-formated composition from an array of DataList(s)
   * @param lists DataLists which the composition is to be created from
   * @returns JSON-formated composition
   */
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

    const postData = JSON.stringify(composition, null, 2);
    console.log(postData);
    return JSON.stringify(composition);
  }

  /**
   * Posts data to the journal via a HTTP-request. Uses createComposition()
   * to convert the data to a proper format before posting it.
   * @param lists DataLists containing data to be posted
   * @returns an observable notifying of the HTTP-requests completion
   */
  public sendData(lists: DataList[]): Observable<{}> {
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
