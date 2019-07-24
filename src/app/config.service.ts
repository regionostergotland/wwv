import { Injectable } from '@angular/core';

export enum AuthenticationMethod {
  BASIC = 'basic',
  ASSISTED_TOKEN = 'assisted_token',
}

@Injectable({
  providedIn: 'root',
})
/**
 * Service to handle all configuration of the application.
 *
 * Configuration can be queried by components and services by using the
 * getters of this service.
 *
 * All configuration is done in the constructor in order to prevent race
 * conditions if components depend on options that haven't yet been set.
 *
 * All configuration have fallback options that will be used if not
 * overridden. The current fallback is to use the ThinkEHR instance at
 * ehrscape.com with basic authentication.
 *
 * Configuration options are overridden by setting the global values
 * corresponding to the option. The global variable has the same name as the
 * key but with the OPT_PREFIX prepended. The OPTION_KEYS array lists the
 * keys for all options.
 *
 * The global variables have to be set before the constructor of this service
 * run. This can be achieved by placing a script tag in the index.html file.
 * An example that makes the application use a different EHR instant with
 * assisted token authentication may look like:
 * ```
 *  <script type="text/javascript">
 *    var appOption_ehrBaseUrl = 'https://myehr.dev/rest/v1';
 *    var appOption_authMethod = 'assisted_token';
 *  </script>
 * ```
 */
export class ConfigService {
  private static OPT_PREFIX = 'appOption_';
  private static OPTION_KEYS: string[] = [
    /* Print error and info messages to the console. */
    'isDebug',
    /* URL to redirect asset requests to. */
    'assetUrl',
    /* Select method to use for autentication to the EHR. */
    'authMethod',

    /* Base URL for all calls to the EHR. */
    'ehrBaseUrl',
    /* Id to the template to use for all compositions. */
    'ehrTemplateId',
    /* EHR namespace for the /ehr/ API calls. */
    'ehrNamespace',

    /* Options for assisted token authentication. */
    'clientId',
    'idpScope',
  ];

  private isDebug = false;
  private assetUrl = 'assets/';
  private authMethod: AuthenticationMethod = AuthenticationMethod.BASIC;

  private ehrBaseUrl = 'https://rest.ehrscape.com/rest/v1/';
  private ehrTemplateId = 'self-reporting';
  private ehrNamespace = 'default';

  private clientId = '';
  private idpScope = '';

  constructor() {
    /* Overwrite options from global variables if declared. */
    for (const key of ConfigService.OPTION_KEYS) {
      const prefixedKey = ConfigService.OPT_PREFIX + key;
      if (window[prefixedKey] !== undefined) {
        this[key] = window[prefixedKey];
      }
    }

    if (this.isDebug) {
      console.log('Debug mode is enabled.');
      console.log('Configuration: ', this);
    }
  }

  /* Getters for configuration options. */

  public getIsDebug(): boolean { return this.isDebug; }
  public getAssetUrl(): string { return this.assetUrl; }
  public getAuthMethod(): AuthenticationMethod { return this.authMethod; }

  public getEhrBaseUrl(): string { return this.ehrBaseUrl; }
  public getEhrTemplateId(): string { return this.ehrTemplateId; }
  public getEhrNamespace(): string { return this.ehrNamespace; }

  public getClientId(): string { return this.clientId; }
  public getIdpScope(): string { return this.idpScope; }
}
