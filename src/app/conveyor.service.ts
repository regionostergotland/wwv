import { CategorySpec, DataList, DataPoint } from './shared/spec'
import { Ehr } from './ehr.service'
import { Platform } from './platform.service'
import { PlatformGoogleFit } from './platform-google-fit.service'

export class Conveyor {
    private readonly ehr: Ehr;
    private readonly platforms: Map<string, Platform>;
    private categories: Map<string, DataList>;

    constructor() {
        this.ehr = new Ehr();
        this.categories = new Map<string, DataList>();
        this.platforms = new Map<string, Platform>([
            [ "google-fit", new PlatformGoogleFit() ]
        ]);
    }

    public getPlatforms(): string[] {
        return Array.from(this.platforms.keys());
    }

    public getCategories(platformId: string): string[] {
        let platform: Platform = this.platforms.get(platformId);
        let categoryIds: string[] = this.ehr.getCategories();
        return categoryIds.filter(id => platform.isAvailable(id));
    }

    public fetchData(platformId: string, categoryId: string,
                     start: string, end: string) {
        if (!this.platforms.has(platformId)) {
            throw TypeError("platform "+platformId+"not available");
        }
        if (!this.categories.has(categoryId)) {
            let spec = this.ehr.getCategorySpec(categoryId);
            this.categories.set(categoryId, new DataList(spec));
        }

        let platform = this.platforms.get(platformId);
        let dataPoints = platform.getData(categoryId, start, end);
        let category = this.categories.get(categoryId);

        category.addPoints(dataPoints);
    }

    public getDataList(categoryId: string): DataList {
        return this.categories.get(categoryId);
    }

    public setDataList(categoryId: string, list: DataList) {
        this.categories.set(categoryId, list);
    }

    public sendData() {
        // TODO authenticate
        for (let category of this.categories.values()) {
            this.ehr.sendData(category);
        }
    }
}
