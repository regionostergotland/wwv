import { Component } from '@angular/core';

import { Conveyor } from './conveyor.service'
import { DataList, DataPoint } from './shared/spec'

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
        this.categories = this.conveyor.getCategories(this.platform)
    }

    getData(category: string) {
        this.conveyor.fetchData(this.platform, category, "0", "-1");
        let data = this.conveyor.getDataList(category);
        this.types = [];
        for (let t of data.spec.dataTypes.keys()) {
            this.types.push(t);
        };
        this.points = [];
        for (let p of data.getPoints()) {
            let values = [];
            for (let v of p.values()) {
                values.push(v);
            }
            this.points.push(values);
        }
    }
}
