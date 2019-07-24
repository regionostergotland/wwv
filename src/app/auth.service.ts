import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, map, concatMap } from 'rxjs/operators';

import { ConfigService, AuthenticationMethod } from 'src/app/config.service';
import { AssistedTokenService } from 'src/app/assisted-token.service';

/* Response from ehr API call */
interface EhrResponse {
  ehrId: string;
  ehrStatus?: {
    modifiable: boolean,
    queryable: boolean,
    subjectId: string,
    subjectNamespace: string
  };
}

/* Response from demographic API call */
interface DemographicResponse {
  parties: [Party];
}

/* Representation of demographic / party in EHR */
interface Party {
  additionalInfo: {
    Personnummer: string,
    civilstånd?: string,
  };
  dateOfBirth: string;
  firstNames: string;
  gender?: string;
  id?: string;
  lastNames: string;
  version?: number;
}

/* All information about a logged in user */
export interface User {
  pnr: string;
  ehrId: string;
  fullName: string;
}

/* Not logged in user */
const EMPTY_USER: User = {
  pnr: '',
  ehrId: '',
  fullName: '',
};

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle all authentication of the application.
 *
 * All authentication and all authenticated requests are made through this
 * service.
 *
 * Currently supported methods are:
 *  - Basic authentication, handled inside this service, by simply storing
 *    the credentials.
 *  - Assisted token, handled by AssistedTokenService.
 *
 * The user must first be signed in by using one of the authenticate methods.
 * Each call after that must then be made with the getAuthenticated or
 * postAuthenticated calls.
 * The user can then be signed out by using the deauthenticate method.
 */
export class AuthService {
  private user: User = EMPTY_USER;
  private authorized = false; /* User is signed in and user struct is valid. */

  private basicCredentials: string; /* Base64 encoded 'user:pass'. */

  constructor(
    private cfg: ConfigService,
    private at: AssistedTokenService,
    private http: HttpClient,
  ) {}

  /**
   * Create HTTP headers for requests with authentication.
   */
  private headers(): Observable<HttpHeaders> {
    let authObs: Observable<string>;
    switch (this.cfg.getAuthMethod()) {
    case AuthenticationMethod.BASIC:
      authObs = of('Basic ' + this.basicCredentials);
      break;
    case AuthenticationMethod.ASSISTED_TOKEN:
      authObs = this.at.getToken();
      break;
    }

    return authObs.pipe(map((authValue: string) =>
      new HttpHeaders({
        Authorization: authValue,
        /* disable cache to prevent unauthorized calls from succeeding */
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      })
    ));
  }

  /**
   * Check if control digit of pnr is correct.
   */
  private controlPnr(pnr: string): boolean {
    const digits: number[] = pnr.replace('-', '')
                                .substring(2, 11)
                                .split('').map(i => +i);
    const ctrl: number = +pnr[12];
    const sum: number = digits
      .map((d: number, i: number) => d * (i % 2 === 0 ? 2 : 1))
      .map((p: number) => p.toString().split('').map(i => +i))
      .map((ds: number[]) => ds.reduce((s, a) => s + a))
      .reduce((s, a) => s + a);
    return ctrl === (10 - (sum % 10)) % 10;
  }

  /**
   * Convert various formats of pnr to YYYMMDD-XXXX format and validate control
   * digit.
   */
  private parsePnr(sub: string): string {
      if (this.cfg.getIsDebug()) {
        console.log('received pnr', sub);
      }

      let pnr: string;
      if (RegExp('^(19|20)[0-9]{6}-[0-9]{4}$').test(sub)) {
        /* YYYYMMDD-XXXX */
        pnr = sub;
      } else if (RegExp('^(19|20)[0-9]{6}[0-9]{4}$').test(sub)) {
        /* YYYYMMDDXXXX */
        pnr = sub.substring(0, 8) + '-' + sub.substring(8);
      } else if (RegExp('^[0-9]{6}-?[0-9]{4}$').test(sub)) {
        /* YYMMDDXXXX */
        if (+sub.substring(0, 2) >= 10) {
          return this.parsePnr('19' + sub);
        } else {
          return this.parsePnr('20' + sub);
        }
      } else {
        throw new Error('Ogiltigt format på personnummer.');
      }

      if (this.cfg.getIsDebug()) {
        console.log('formatting to', pnr);
      }

      if (!this.controlPnr(pnr)) {
        throw new Error('Felaktig kontrollsiffra i angett personnummer.');
      }

      return pnr;
  }

  /*
   * Get party / patient by personal identity number (personnummer).
   */
  private fetchParty(pnr: string): Observable<Party> {
    const params: HttpParams = new HttpParams().set('Personnummer', pnr);
    return this.getAuthenticated<DemographicResponse>(
      'demographics/party/query', params)
      .pipe(map((res: DemographicResponse) => {
        if (res && res.parties.length > 0) {
          return res.parties[0]; // assume only one person with pnr
        } else {
          throw(new Error(`Det finns ingen patient med det givna
                           personnumret.`));
        }
      }));
  }

  /**
   * Get EHR ID by subject ID.
   */
  private fetchEhrId(subjectId: string): Observable<string> {
    const params: HttpParams = new HttpParams()
      .set('subjectId', subjectId)
      .set('subjectNamespace', this.cfg.getEhrNamespace());
    return this.getAuthenticated<EhrResponse>('ehr', params)
      .pipe(map((res: EhrResponse) => {
        if (res) {
          return res.ehrId;
        } else {
          throw new Error('Det finns ingen journal för den givna patienten.');
        }
      }));
  }

  /**
   * Validate and set the user on login.
   *
   * Fails with error if
   *  - pnr is not valid
   *  - authorization is invalid (for demographic/ehr call)
   *  - domain has no demographic for pnr
   *  - domain has no ehr for pnr
   *  - network errors
   *
   * If no errors:
   *  - pnr is set
   *  - ehrId is set
   *  - subjectId is set
   *  - authorized is set
   */
  private validate(pnrObs: Observable<string>): Observable<any> {
    return pnrObs.pipe(
      map(this.parsePnr.bind(this)),
      tap((pnr: string) => this.user.pnr = pnr),
      concatMap(this.fetchParty.bind(this)),
      tap((party: Party) => this.user.fullName = party.firstNames + ' ' +
                                                 party.lastNames),
      concatMap((party: Party) => this.fetchEhrId(party.id)),
      tap((ehrId: string) => this.user.ehrId = ehrId),
      tap((_ => this.authorized = true)),
    );
  }

  /**
   * Sign in user using basic authentication.
   */
  public authenticateBasic(user: string, pw: string,
                           pnr: string): Observable<any> {
    this.basicCredentials = btoa(user + ':' + pw);
    return this.validate(of(pnr));
  }

  /**
   * Sign in user using assisted token authentication.
   */
  public authenticateAT(): Observable<any> {
    return this.validate(this.at.getPnr());
  }

  /**
   * Sign out user.
   */
  public deauthenticate(): void {
    this.authorized = false;
    this.user = EMPTY_USER;
    this.basicCredentials = '';
  }

  /**
   * Perform a GET request with current authentication to a given API call with
   * the given parameters.
   * @param call URL to API call excluding base URL
   * @param params HttpParams object
   */
  public getAuthenticated<T>(call: string,
                             params: HttpParams = null): Observable<T> {
    return this.headers().pipe(concatMap(hs => {
      const url = this.cfg.getEhrBaseUrl() + call;
      const options = {
        params,
        headers: hs
      };
      return this.http.get<T>(url, options);
    }));
  }

  /**
   * Perform a POST request with current authentication to a given API call
   * with the given parameters and the given body.
   * @param call URL to API call excluding base URL
   * @param params HttpParams object
   * @param body JSON object to send as body
   */
  public postAuthenticated<T>(call: string, body = {},
                              params: HttpParams = null): Observable<T> {
    return this.headers().pipe(concatMap(hs => {
      const url = this.cfg.getEhrBaseUrl() + call;
      const options = {
        params,
        headers: hs
      };
      return this.http.post<T>(url, body, options);
    }));
  }

  /**
   * User has authenticated and pnr, ehrId, subjectId are valid.
   */
  public isAuthenticated(): boolean {
    return this.authorized;
  }

  /**
   * Get what authentication method is used.
   */
  public method(): AuthenticationMethod { return this.cfg.getAuthMethod(); }

  /**
   * Get all information about the signed in user.
   */
  public getUser(): User { return this.user; }
}
