import { Injectable } from '@angular/core';
import { Observable, fromEvent, from, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ConfigService } from 'src/app/config.service';

interface ATSettings {
  clientId: string;
  scope: string;
}

interface IDTokenBody {
  sub: string;
}

interface AdditionalData {
  token: string; /* base 64 encoded IDToken*/
  key: string;
}

interface Login {
  token: string;
  expires: number; /* epoch time */
}

interface LoginFailure {
  error_code: number;
  error_description: string;
}

interface Assistant {
  revokeTokens: any;
  getAdditionalData(): AdditionalData;
  getAuthHeader(): string;
  isAuthenticated(): boolean; /* always false? */
  isExpired(): boolean;       /* always true? */
  loginIfRequired(): Promise<Login|LoginFailure>;
  logout(): any;
}

interface AssistedToken {
  constants: {
    authentication_endpoint: string,
    hostUrl: string,
    logout_endpoint: string,
    revoke_endpoint: string,
    token_endpoint: string,
  };
  assistant(ATSettings): Assistant;
}

interface Curity {
  token: AssistedToken;
  debug: boolean;
}

declare var curity: Curity;

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle authentication with the assisted token workflow.
 *
 * There are only two public methods. Both methods return an observable that,
 * when subscribed to, will prompt the user to sign in and only finish after
 * the sign in is complete.
 *
 * Subsequent calls to any of the methods will not require sign in until the
 * session expires, and the observables shall finish immediately.
 *
 * Remark:
 *  This service uses an external library "Curity" that is loaded from an
 *  external server. The script sets a global variable 'curity' that can be
 *  used to access the library. It is however only set after the script has
 *  been loaded and run. The constructor of this service may be executed before
 *  the script has been run and can therefore not initialize the library.
 *
 *  Because of this, all methods are asynchronous and return observations that
 *  wait for the DOM if needed to make sure that the curity variable is set
 *  before doing anything. The assistant object will be initalized only the
 *  first time any of the observables are subscribed to.
 */
export class AssistedTokenService {
  private assistant: Assistant = null;

  constructor(private cfg: ConfigService) {}

  /**
   * Create an observable that finishes when the DOM is loaded.
   * Will finish immediately if already loaded.
   */
  private waitForDom(): Observable<Event> {
    if (document.readyState === 'loading') {
      return fromEvent(document, 'DOMContentLoaded');
    } else {
      return of(null);
    }
  }

  /**
   * Create an observable that return an assistant that is authenticated and
   * ready to use.
   */
  private withAuth(): Observable<Assistant> {
    return this.waitForDom().pipe(
      map(() => {
        if (this.assistant) {
          return this.assistant;
        } else {
          const settings: ATSettings = {
            clientId: this.cfg.getClientId(),
            scope: this.cfg.getIdpScope(),
          };

          if (curity) {
            curity.debug = this.cfg.getIsDebug();
            return curity.token.assistant(settings);
          } else {
            throw(new Error('Curity kunde inte laddas.'));
          }
        }
      }),
      concatMap((a: Assistant) => from(a.loginIfRequired()).pipe(map(_ => a)))
    );

  }

  /**
   * Get personal identity number for the signed in user.
   *
   * Will prompt sign in if needed.
   */
  public getPnr(): Observable<string> {
    return this.withAuth().pipe(map((assist: Assistant) => {
      const tokenParts: string[] = assist.getAdditionalData().token.split('.');
      const body: IDTokenBody = JSON.parse(atob(tokenParts[1]));

      return body.sub;
    }));
  }

  /**
   * Get authentication token to use in the 'Authorization' header.
   *
   * Will prompt sign in if needed.
   */
  public getToken(): Observable<string> {
    return this.withAuth().pipe(map((assist: Assistant) =>
      assist.getAuthHeader()
    ));
  }
}
