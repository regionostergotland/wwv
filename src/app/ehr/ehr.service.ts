import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { EHR_CONFIG, EhrConfig } from './ehr-config';
import { CategorySpec } from './datatype';
import { DataList } from './datalist';

interface CompositionResponse {
  action: string;
  compositionUid: string;
  meta: {};
}

interface EhrResponse {
  ehrId: string;
  ehrStatus: {
    modifiable: boolean,
    queryable: boolean,
    subjectId: string,
    subjectNamespace: string
  };
  meta: {};
}

interface DemographicResponse {
  action: string;
  meta: {};
  parties: [Party];
}

interface Party {
  additionalInfo: {
    Personnummer: string,
    civilstånd: string,
  };
  dateOfBirth: string;
  firstNames: string;
  gender: string;
  id: string;
  lastNames: string;
  version: number;
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

  /*
   * create a URL given a call and a list of parameters
   * @param call URL to API call excluding base URL
   * @param params list of [key, value] pairs
   */
  private createUrl(call: string, params): string {
    let url = this.config.baseUrl + call + '?';
    for (const [key, value] of params) {
      url += key + '=' + value + '&';
    }
    return url;
  }

  /*
   * Perform a GET request to a given API call with the given parameters.
   * @param call URL to API call excluding base URL
   * @param params list of [key, value] pairs
   */
  private get<T>(call: string, params: string[][]): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Basic ' + this.basicCredentials
      })
    };
    return this.http.get<T>(this.createUrl(call, params), options);
  }

  /*
   * Perform a POST request to a given API call with the given parameters and
   * the given body
   * @param call URL to API call excluding base URL
   * @param params list of [key, value] pairs
   * @param body JSON object to send as body
   */
  private post<T>(call: string, params: string[][], body): Observable<T> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    };
    return this.http.post<T>(this.createUrl(call, params), body, options);
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

  /* Get party ID by partyID */
  private getEhrId(partyId: string): Observable<any> {
    const params = [
      ['subjectId', partyId],
      ['subjectNamespace', 'default']
    ];
    return this.get<EhrResponse>('ehr', params).pipe(map(
        res => res.ehrId
    ));
  }

  /* Get party ID by personal identity number (personnummer) */
  private getPartyId(pnr: string): Observable<any> {
    const params = [['personnummer', pnr]];
    return this.get<DemographicResponse>('demographics/party/query', params)
      .pipe(map(
        res => {
          if (res && res.parties.length > 0) {
            return res.parties[0].id; // assume only one person with pnr
          } else {
            throw new Error('no individual with given pnr');
          }
        }
    ));
  }

  /*
   * Create a composition of the given datalists to the EHR with the given
   * ehrID.
   * @returns composition UID of the created composition
   */
  private postComposition(ehrId: any, lists: DataList[]):
      Observable<CompositionResponse> {
    const params = [
      ['ehrId', ehrId],
      ['templateId', this.config.templateId],
      ['format', 'STRUCTURED'],
    ];
    return this.post<CompositionResponse>('composition', params,
                                          this.createComposition(lists));
  }

  /*
   * Create a composition of the given datalists to the EHR belonging to the
   * individual with the given pnr.
   */
  public sendData(pnr: string, lists: DataList[]): Observable<string> {
    return this.getPartyId(pnr)
      .pipe(switchMap(this.getEhrId.bind(this)))
      .pipe(switchMap(
          ehrId => this.postComposition(ehrId, lists)))
      .pipe(map(
        res => res.compositionUid));
  }

  public authenticateBasic(user: string, pass: string) {
    this.basicCredentials = btoa(user + ':' + pass);
  }
}
