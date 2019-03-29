import { Injectable } from '@angular/core';

import { CategorySpec, DataList, DataPoint } from './shared/spec';
import { EhrService } from './ehr/ehr.service';
import { Platform } from './platform/platform.service';
import { GfitService } from './platform/gfit.service';
import { DummyPlatformService } from './platform/dummy.service';
import { of, Observable, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class Conveyor {
    private readonly platforms: Map<string, Platform>;
    private categories: Map<string, DataList>;

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

    public signIn(platformId: string): void {
        const platform: Platform = this.platforms.get(platformId);
        platform.signIn();
    }

    public signOut(platformId: string): void {
        const platform: Platform = this.platforms.get(platformId);
        platform.signOut();
    }

    public getPlatforms(): string[] {
        return Array.from(this.platforms.keys());
    }

    public getCategories(platformId: string): string[] {
        const platform: Platform = this.platforms.get(platformId);
        const categoryIds: string[] = this.ehrService.getCategories();
        return categoryIds.filter(id => platform.isAvailable(id));
    }

    public fetchData(platformId: string, categoryId: string, start: Date, end: Date): Observable<any> {
        if (!this.platforms.has(platformId)) {
            throw TypeError('platform ' + platformId + 'not available');
        }
        if (!this.categories.has(categoryId)) {
            const spec = this.ehrService.getCategorySpec(categoryId);
            this.categories.set(categoryId, new DataList(spec));
        }

        const platform = this.platforms.get(platformId);
        const category: DataList = this.getDataList(categoryId);
        // Add points to category and return an empty observable for the GUI to subscribe to
        return platform.getData(categoryId, start, end).pipe(map( res => { category.addPoints(res); return EMPTY; }));
    }

    public getDataList(categoryId: string): DataList {
        return this.categories.get(categoryId);
    }

    public setDataList(categoryId: string, list: DataList) {
        this.categories.set(categoryId, list);
    }

    public authenticateBasic(username: string, password: string) {
        console.log("authing "+username);
        this.ehrService.authenticateBasic(username, password);
    }

    public sendData(): Observable<{}> {
        // TODO authenticate
        for (const category of this.categories.values()) {
            return this.ehrService.sendData(category);
        }
    }
}
