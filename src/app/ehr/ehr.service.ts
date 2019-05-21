import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { EHR_CONFIG, EhrConfig } from './ehr-config';
import { CategorySpec } from './datatype';
import { DataList } from './datalist';

/* Receipt for composition creation */
interface CompositionReceipt {
  pnr: string;
  composition: {};
  partyId: string;
  ehrId: string;
  compUid: string;
}

/* Response from composition API call */
interface CompositionResponse {
  action: string;
  compositionUid: string;
  meta: {};
}

/* Response from ehr API call */
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

/* Response from demographic API call */
interface DemographicResponse {
  action: string;
  meta: {};
  parties: [Party];
}

/* Representation of individual in EHR */
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

  /* Get the specification of an available category.
   * @param id of category returned by getCategories.
   */
  public getCategorySpec(categoryId: string): CategorySpec {
    return this.config.categories.find(e => e.id === categoryId);
  }

  /* Get a list of available categories of data. */
  public getCategories(): string[] {
    const cats = [];

    for (const cat of this.config.categories) {
      cats.push(cat.id);
    }
    return cats;
  }

  /*
   * Perform a GET request to a given API call with the given parameters.
   * @param call URL to API call excluding base URL
   * @param params HttpParams object
   */
  private get<T>(call: string, params: HttpParams): Observable<T> {
    const options = {
      params,
      headers: new HttpHeaders({
        Authorization: 'Basic ' + this.basicCredentials
      })
    };
    return this.http.get<T>(this.config.baseUrl + call, options);
  }

  /*
   * Perform a POST request to a given API call with the given parameters and
   * the given body
   * @param call URL to API call excluding base URL
   * @param params HttpParams object
   * @param body JSON object to send as body
   */
  private post<T>(call: string, params: HttpParams, body): Observable<T> {
    const options = {
      params,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + this.basicCredentials
      })
    };
    return this.http.post<T>(this.config.baseUrl + call, body, options);
  }

  /* Get party ID by personal identity number (personnummer) */
  private getPartyId(pnr: string): Observable<any> {
    const params = new HttpParams().set('personnummer', pnr);
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
  private postComposition(ehrId: any, composition: {}):
      Observable<CompositionResponse> {
    const params = new HttpParams()
      .set('ehrId', ehrId)
      .set('templateId', this.config.templateId)
      .set('format', 'STRUCTURED');
    return this.post<CompositionResponse>('composition', params, composition);
  }

  /* Get party ID by partyID */
  private getEhrId(partyId: string): Observable<string> {
    const params = new HttpParams()
      .set('subjectId', partyId)
      .set('subjectNamespace', 'default');
    return this.get<EhrResponse>('ehr', params).pipe(map(
        res => res.ehrId
    ));
  }

  /* Authenticate to EHR with username and password */
  public authenticateBasic(user: string, pass: string) {
    this.basicCredentials = btoa(user + ':' + pass);
  }

  /* Create a composition of given data lists */
  public createComposition(lists: DataList[]): {} {
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
            element[id] = [dataType.toRest(value)];
          }
        }
      }
    }

    return composition;
  }

  /*
   * Send a composition to the EHR of individual with given pnr.
   * @param pnr Personal identity number of individual associated with ehr the
   * composition is created in.
   * @param composition Composition created using createComposition method
   */
  public sendComposition(pnr: string,
                         composition: {}): Observable<CompositionReceipt> {
    let receipt: CompositionReceipt = {
      'pnr': pnr,
      'composition': composition,
      'partyId': '',
      'ehrId': '',
      'compUid': '',
    };
    return this.getPartyId(pnr)
      .pipe(switchMap((partyId: string) => {
          receipt.partyId = partyId;
          return this.getEhrId(partyId);
        }))
      .pipe(switchMap((ehrId: string) => {
          receipt.ehrId = ehrId;
          return this.postComposition(ehrId, composition);
        }))
      .pipe(map((res: CompositionResponse) => {
          receipt.compUid = res.compositionUid;
          return receipt;
        }));
  }
}
