import { Injectable } from '@angular/core';

import { DataList } from './ehr/datalist';
import { EhrService } from './ehr/ehr.service';
import { Platform } from './platform/platform.service';
import { GfitService } from './platform/gfit.service';
import { DummyPlatformService } from './platform/dummy.service';
import { Observable, EMPTY, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Conveyor {
  private readonly platforms: Map<string, Platform>;
  private categories: Map<string, DataList>;
  private selectedPlatform: string;

  constructor(
    private ehrService: EhrService,
    private gfitService: GfitService,
    private dummyPlatformService: DummyPlatformService) {
    this.categories = new Map<string, DataList>();
    this.platforms = new Map<string, Platform>([
      [ 'google-fit', this.gfitService ],
      [ 'dummy', this.dummyPlatformService ]
    ]);
  }

  public async signIn(platformId: string) {
    const platform: Platform = this.platforms.get(platformId);
    await platform.signIn();
  }

  public signOut(platformId: string): void {
    const platform: Platform = this.platforms.get(platformId);
    platform.signOut();
  }

  public getPlatforms(): string[] {
    return Array.from(this.platforms.keys());
  }

  public getAvailableCategories(platformId: string): Observable<string[]> {
    const platform: Platform = this.platforms.get(platformId);
    return platform.getAvailable();
  }

  public getCategoryIds(): string[] {
    return Array.from(this.categories.keys());
  }

  public hasCategoryId(categoryId: string): boolean {
    return this.categories.has(categoryId);
  }

  public getAllCategories(): string[] {
    return this.ehrService.getCategories();
  }

  public fetchData(platformId: string, categoryId: string,
                   start: Date, end: Date): Observable<any> {
      if (!this.platforms.has(platformId)) {
        throw TypeError('platform ' + platformId + 'not available');
      }
      if (!this.categories.has(categoryId)) {
        const spec = this.ehrService.getCategorySpec(categoryId);
        this.categories.set(categoryId, new DataList(spec));
      }

      const platform = this.platforms.get(platformId);
      const category: DataList = this.getDataList(categoryId);
      // Add points to category and return an empty observable for the GUI to
      // subscribe to
      return platform.getData(categoryId, start, end)
      .pipe(map(res => {
        category.addPoints(res); return EMPTY;
      }));
    }

  public getDataList(categoryId: string): DataList {
    if (this.categories.has(categoryId)) {
      return this.categories.get(categoryId);
    } else {
      throw TypeError('category ' + categoryId + ' not in map');
    }
  }

  public setDataList(categoryId: string, list: DataList) {
    this.categories.set(categoryId, list);
  }

  public getCategorySpec(categoryId: string) {
    return this.ehrService.getCategorySpec(categoryId);
  }

  public authenticateBasic(username: string, password: string) {
    this.ehrService.authenticateBasic(username, password);
  }

  public sendData(pnr: string): Observable<{}> {
    const composition = this.ehrService.createComposition(
      Array.from(this.categories.values())
    );
    return this.ehrService.sendComposition(pnr, composition);
  }

  /*
   * Saves the platform to be fetched from.
   * @param platformId The chosen platform
   */
  public selectPlatform(platformId: string) {
    this.selectedPlatform = platformId;
  }

  /*
   * Gets the current selected platform.
   * @returns the currently selected platform.
   */
  public getSelectedPlatform(): string {
    return this.selectedPlatform;
  }
}
