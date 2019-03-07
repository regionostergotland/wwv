import { Category, CategorySpec, DataPoint } from './shared/spec'
import { Ehr } from './ehr.service'
import { Platform } from './platform.service'
import { PlatformGoogleFit } from './platform-google-fit.service'

export class Conveyor {
    private readonly platforms: Map<string, Platform>;
    private categories: Map<string, Category>;
    private readonly ehr: Ehr;

    constructor() {
        this.ehr = new Ehr();
        this.categories = new Map<string, Category>();
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
            this.categories.set(categoryId, new Category());
        }

        let platform = this.platforms.get(platformId);
        let spec = this.ehr.getCategorySpec(categoryId);
        let dataPoints = platform.getData(spec, start, end);
        let category = this.categories.get(categoryId);

        category.addPoints(dataPoints);
    }

    public getPoints(categoryId: string): DataPoint[] {
        let category = this.categories.get(categoryId);

        if (category) {
            return category.getPoints();
        } else {
            throw TypeError("category with id "+categoryId+" not available.");
        }
    }

    public addPoint(categoryId: string, point: DataPoint) {
        this.categories.get(categoryId).addPoint(point);
    }

    public sendData() {
        // TODO authenticate
        for (let [id, category] of this.categories.entries()) {
            this.ehr.sendData(id, category.getPoints());
        }
    }
}

let conveyor = new Conveyor();
