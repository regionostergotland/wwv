import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from 'src/app/config.service';
import { EHR_CONFIG, EhrConfig } from './ehr-config';
import { CategorySpec } from './datatype';
import { DataList } from './datalist';
import { AuthService } from 'src/app/auth.service';

/* Receipt for composition creation */
export interface CompositionReceipt {
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

@Injectable({
  providedIn: 'root',
})
export class EhrService {
  constructor(
    @Inject(EHR_CONFIG) private ehrConfig: EhrConfig,
    private cfg: ConfigService,
    private auth: AuthService,
  ) {}

  /* Get the specification of an available category.
   * @param id of category returned by getCategories.
   */
  public getCategorySpec(categoryId: string): CategorySpec {
    return this.ehrConfig.categories.find(e => e.id === categoryId);
  }

  /* Get a list of available categories of data. */
  public getCategories(): string[] {
    const cats = [];

    for (const cat of this.ehrConfig.categories) {
      cats.push(cat.id);
    }
    return cats;
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
      .set('templateId', this.cfg.getEhrTemplateId())
      .set('format', 'STRUCTURED');
    return this.auth.postAuthenticated<CompositionResponse>(
      'composition', composition, params
    );
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

      let pIndex = 0; /* index of current point in list */
      // (fn shall be used when known how)
      // tslint:disable-next-line
      for (const [fn, points] of list.getPoints()) {
        // TODO specify math function of events
        // how to specify??
        for (const point of points) {
          for (const [id, value] of point.entries()) {
            const dataType = spec.dataTypes.get(id);
            if (value !== '' && value) {
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
                if (!container[pIndex]) {
                  container[pIndex] = {};
                }
                element = container[pIndex];
              }
              element[id] = [dataType.toRest(value)];
            }
          }
          pIndex++;
        }
      }
    }

    return composition;
  }

  /*
   * Send a composition to the EHR of individual with given configured pnr.
   * @param composition Composition created using createComposition method
   */
  public sendComposition(composition: {}): Observable<CompositionReceipt> {
    const pnr = this.auth.getUser().pnr;
    const receipt: CompositionReceipt = {
      pnr,
      composition,
      partyId: '',
      ehrId: '',
      compUid: '',
    };
    return this.postComposition(this.auth.getUser().ehrId, composition)
      .pipe(map((res: CompositionResponse) => {
          receipt.compUid = res.compositionUid;
          return receipt;
        }));
  }
}
