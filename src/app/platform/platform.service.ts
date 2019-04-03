import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataPoint } from '../ehr/ehr-types';
import { setInjectImplementation } from '@angular/core/src/di/injector_compatibility';
import { strictEqual } from 'assert';
import { stringify } from '@angular/core/src/util';
import { CategoryEnum } from '../ehr/ehr-config';

/**
 * Contains necessary properties for all categories.
 */
export interface CategoryProperties {
  url: string;
  dataTypes: string[];
  /* This maps available data types for the category to a function
   that's used to convert the data type to the internal data format */
  dataTypeConversions: Map<string, (src: any) => any>;
}

@Injectable({
  providedIn: 'root',
})
export abstract class Platform {

  // Implemented categories for each specific health platform
  protected implementedCategories: Map<string, CategoryProperties>;
  protected available: string[] = [];

  constructor() {
  }

  public abstract async signIn();

  public abstract signOut(): void;

  public abstract getAvailable(): Observable<string[]>;

  protected abstract setImplemented(): void;

  protected isImplemented(categoryId: string): boolean {
    const keys: Iterable<string> = this.implementedCategories.keys();
    for (const key of keys) {
      if (key === categoryId) {
        return true;
      }
    }
    return false;
  }

  public abstract getData(categoryId: string,
                          start: Date, end: Date): Observable<any>;


  protected abstract convertData(res: any, categoryId: string): DataPoint[];
}
