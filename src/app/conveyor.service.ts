import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { CategorySpec, DataList, DataPoint } from './shared/spec';
import { EhrService } from './ehr/ehr.service';
import { Platform } from './platform/platform.service';
import { GfitService } from './platform/gfit.service';
import { of, Observable, EMPTY } from 'rxjs';
import { catchError, map, tap, filter, mergeMap, merge } from 'rxjs/operators';
import { PlayState } from '@angular/core/src/render3/interfaces/player';


@Injectable({
    providedIn: 'root'
})
export class Conveyor {
    private readonly platforms: Map<string, Platform>;
    private categories: Map<string, DataList>;
    private selectedCategories: string[];
    private selectedPlatform: string;

    constructor(
        private messageService: MessageService,
        private ehrService: EhrService,
        private gfitService: GfitService) {
        this.categories = new Map<string, DataList>();
        this.selectedCategories = [];
        this.platforms = new Map<string, Platform>([
            [ 'google-fit', this.gfitService ]
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

    public getAvailableCats(platformId: string): string[] {
        const platform: Platform = this.platforms.get(platformId);
        const available: string[] = platform.getAvailable();
        const categoryIds: string[] = this.ehrService.getCategories();
        return categoryIds.filter(id => available.includes(id));
    }

    public getCategories(platformId: string): Observable<any> {
        const platform: Platform = this.platforms.get(platformId);
        const categoryIds: string[] = this.ehrService.getCategories();
        console.log("Getting categories");
        return platform.getCategories().pipe(map(_ => EMPTY ));
        /*return platform.getAvailable().pipe(map(res => {
            available = res;
        }));*/
        // categoryIds.filter(id => platform.isAvailable(id));
    }

    /*
    * Removes a selected category from the selected list
    * */
    public unselectCategory(categoryId: string) {
        if (this.selectedCategories.includes(categoryId)) {
            this.selectedCategories.splice(this.selectedCategories.indexOf(categoryId), 1);
        }
    }

    /*
    * Adds a new category to the selected list
    * */
    public selectCategory(categoryId: string) {
        if (!this.selectedCategories.includes(categoryId)) {
            this.selectedCategories.push(categoryId);
        }
    }

    public getSelectedCategories(): string[] {
        return this.selectedCategories;
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

    public getCategorySpec(categoryId: string) {
        return this.ehrService.getCategorySpec(categoryId);
    }

    public sendData() {
        // TODO authenticate
        for (const category of this.categories.values()) {
            this.ehrService.sendData(category);
        }
    }

    /*
    * Saves the platform to be fetched from.
    * @param platformId The chosen platform
    * */
    public selectPlatform(platformId: string) {
        this.selectedPlatform = platformId;
    }

    /*
    * Gets the current selected platform.
    * @returns the currently selected platform.
    * */
    public getSelectedPlatform(): string {
        console.log("Returning " + this.selectedPlatform);
        return this.selectedPlatform;
    }
}
