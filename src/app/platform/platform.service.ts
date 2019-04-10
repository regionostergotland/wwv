import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Contains necessary properties for all categories.
 */
export interface CategoryProperties {
  url: string;
  /* This maps available data types for the category to a function
   that's used to convert the data type to the internal data format */
  dataTypes: Map<string, (src: any) => any>;
}

@Injectable({
  providedIn: 'root',
})
export abstract class Platform {
  // Implemented categories for each specific health platform
  protected implementedCategories: Map<string, CategoryProperties>;

  constructor() {
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
