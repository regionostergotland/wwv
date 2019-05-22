import { Observable } from 'rxjs';
import { DataPoint } from '../ehr/datalist';

/**
 * Contains necessary properties for all categories.
 * dataTypes maps category strings to functions that convert
 * category-specific datatypes to the internal format.
 */
export interface CategoryProperties {
  url: string;
  /* This maps available data types for the category to a function
   that's used to convert the data type to the internal data format */
  dataTypes: Map<string, (src: any) => any>;
}

export abstract class Platform {
  // Implemented categories for each specific health platform
  protected implementedCategories: Map<string, CategoryProperties>;

  constructor() {}

  public abstract async signIn();
  public abstract signOut(): void;

  /* Check all available categories */
  public abstract getAvailable(): Observable<string[]>;

  /* Fetch all data of a specific category within a date interval.
   * @param categoryId id of category to fetch
   * @param start start time of interval
   * @param end end time of interval
   * @returns a observable that fetches and converts data
   */
  public abstract getData(categoryId: string,
                          start: Date, end: Date): Observable<DataPoint[]>;

  /* Check if a specific category is implemented */
  protected isImplemented(categoryId: string): boolean {
    const keys: Iterable<string> = this.implementedCategories.keys();
    for (const key of keys) {
      if (key === categoryId) {
        return true;
      }
    }
    return false;
  }
}
