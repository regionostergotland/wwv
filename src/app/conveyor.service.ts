import { Category, CategorySpec } from './shared/spec'
import { Ehr } from './ehr.service'
import { Platform } from './platform.service'
import { PlatformGoogleFit } from './google_fit.service'

export class Conveyor {
    private platforms: Map<string, Platform>;
    private categories: Map<string, Category>;
    private ehr: Ehr = null;

    constructor() {
        this.ehr = new Ehr();
        this.platforms.set("google-fit", new PlatformGoogleFit());
    }

    public getPlatforms(): string[] {
        return this.platforms.keys();
    }

    public getCategories(platformId: string): string[] {
        let platform: Platform = this.platform.get(platformId);
        let catsAvailable: string[] = [];
        let catsAll: string[] = this.ehr.getCategories();

        for (let catId of catsAll) {
            let spec: CategorySpec = this.ehr.getCategorySpec(catId);
            if (platform.isAvailable(spec)) {
                catsAvailable.push(catId);
            }
        }

        return catsAvailable;
    }

    public fetchData(platformId: string, categoryId: string,
                     start: string, end: string) {
        /*
        let platform = this.getPlatform(platformId);
        if (!platform) {
            return;
        }

        let spec = this.ehr.getCategorySpec(categoryId);
        let category: Category = this.getCategory(categoryId);

        if (!category) {
            let raw = platform.getData(categoryId, spec.data, start, end);
            let states: State[] = [];
            for (let i = 0; i < spec.states.length; i++) {
                states.push({
                    "id": spec.states[i].id,
                    "input": ""
                });
            }

            category = {
                "spec": spec,
                "raw": raw,
                "processed": {
                    "raw" : raw,
                    "states" : states,
                },
            };

            this.categories.push(category);
        } else {
            // TODO merge to current raw/processed (or use list of raws?)
        }
         */
    }

    public getPoints(categoryId: string): DataPoints[] {
        return this.categories.get(categoryId).getPoints();
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
