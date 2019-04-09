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
  /* This maps available data types for the category to a function
   that's used to convert the data type to the internal data format */
  dataTypes: Map<string, (src: any) => any>;
}

export abstract class Platform {
  // Implemented categories for each specific health platform
  protected readonly implementedCategories: Map<string, CategoryProperties>;

  constructor(implementedCategories: Map<string, CategoryProperties>) {
    this.implementedCategories = implementedCategories;
  }

  public abstract async signIn();
  public abstract signOut(): void;

  public abstract getAvailable(): Observable<string[]>;

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
}
