import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { EHR_CONFIG, EhrConfig } from './ehr-config';
import { CategorySpec } from './datatype';
import { DataList } from './datalist';

interface EhrResponse {
  ehrId: string,
  ehrStatus: {
    modifiable: boolean,
    queryable: boolean,
    subjectId: string,
    subjectNamespace: string
  },
  meta: {}
}

interface DemographicResponse {
  action: string,
  meta: {},
  parties: [Party]
}

interface Party {
  additionalInfo: {
    Personnummer: string,
    civilstånd: string,
  }
  dateOfBirth: string,
  firstNames: string,
  gender : string,
  id : string,
  lastNames: string,
  version: number
}

// TODO create separate in-module service for API calls to EHR
//      or at least somehow avoid repetition for calls in the methods below
// TODO use newly available openEHR standard instead of THINKEHR

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

  private createUrl(baseUrl: string, params): string {
    let url = baseUrl + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }
    return url;
  }

  private post<T>(baseUrl: string, params, body): Observable<{}> {
    let url = baseUrl + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    }

    return this.http.post<T>(url, body, options);
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

    return JSON.stringify(composition);
  }

  private getEhrId(partyId: string): Observable<any> {
    let url = this.config.baseUrl + 'ehr'
    const params = [
      ['subjectId', partyId],
      ['subjectNamespace', 'default']
    ]

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + this.basicCredentials
      })
    }

    return this.http.get<EhrResponse>(this.createUrl(url, params), options)
      .pipe(map(
        res => { return res.ehrId; }
      ));
  }

  private getPartyId(pnr: string): Observable<any> {
    let url = this.config.baseUrl + 'demographics/party/query'
    const params = [
      ["personnummer", pnr]
    ]
    const query = [
      { 
        "key": "personnummer",
        "value": pnr
      }
    ]

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + this.basicCredentials
      })
    }

    return this.http.get<DemographicResponse>(this.createUrl(url, params), options)
      .pipe(map(
        res => { return res.parties[0].id; } // assume only one person with pnr
    ));
  }

  private sendDataToEhr(ehrId: any, lists: DataList[]): Observable<any> {
    let url = this.config.baseUrl + '/composition'

    const params = [
      ['ehrId', ehrId],
      ['templateId', this.config.templateId],
      ['format', 'STRUCTURED'],
    ];

    const composition = this.createComposition(lists);

    return this.post(url, params, composition);
  }

  public sendData(pnr: string, lists: DataList[]): Observable<any> {
    return this.getPartyId(pnr)
      .pipe(switchMap(this.getEhrId.bind(this)))
      .pipe(switchMap(
          ehrId => { return this.sendDataToEhr(ehrId, lists); }
      ))
  }

  public authenticateBasic(user: string, pass: string) {
    this.basicCredentials = btoa(user + ':' + pass);
  }
}
