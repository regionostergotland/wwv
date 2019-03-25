import { Component } from '@angular/core';

import { Conveyor } from './conveyor.service';
import { DataList, DataPoint } from './shared/spec';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'wwv';
    platform: string;
    platforms: string[] = [];
    categories: string[] = [];
    types: string[] = [];
    points: any[][] = [];

    constructor(private conveyor: Conveyor) { }

    getPlatforms(): void {
        this.platforms = this.conveyor.getPlatforms();
    }

    getCategories(platform: string): void {
        this.platform = platform;
        this.categories = this.conveyor.getCategories(this.platform);
    }

    getData(category: string) {
        this.conveyor.fetchData(this.platform, category,
                                new Date(), new Date());
        const data = this.conveyor.getDataList(category);
        this.types = [];
        for (const t of data.spec.dataTypes.keys()) {
            this.types.push(t);
        }
        this.points = [];
        for (const p of data.getPoints()) {
            const values = [];
            for (const v of p.values()) {
                values.push(v);
            }
            this.points.push(values);
        }
    }
}
