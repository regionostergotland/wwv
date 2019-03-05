import { Category, CategorySpec, RawData, ProcessedData } from './shared/interface'
import { Ehr } from './ehr.service'
import { Platform } from './platform.service'
import { PlatformGoogleFit } from './google_fit.service'

export class Conveyor {
    private platforms: Platform[] = [];
    private categories: Category[] = [];
    private ehr: Ehr = null;

    constructor() {
        this.ehr = new Ehr();
        this.platforms.push(new PlatformGoogleFit());
    }

    private getPlatform(platformId: string): Platform {
        for (let i = 0; i < this.platforms.length; i++) {
            let plat = this.platforms[i];
            if (plat.id == platformId) {
                return plat;
            }
        }
        return null;
        //return this.platforms.find(e => e.id == platformId);
    }

    private getCategory(categoryId): Category {
        for (let i = 0; i < this.categories.length; i++) {
            let cat: Category = this.categories[i];
            if (cat.spec.id == categoryId) {
                return cat;
            }
        }
        return null;
        //return this.categories.find(e => e.spec.id == categoryId);
    }

    public getPlatforms(): string[] {
        let plats: string[] = [];
        for (let i = 0; i < this.platforms.length; i++) {
            plats[i] = this.platforms[i].id;
        }
        return plats;
    }

    public getCategories(platformId: string): string[] {
        let platform: Platform = this.getPlatform(platformId);
        if (!platform) return [];

        let catsAvailable: string[] = [];
        let catsAll: string[] = this.ehr.getCategories();

        for (let i = 0; i < catsAll.length; i++ ) {
            let catId = catsAll[i];
            let spec: CategorySpec = this.ehr.getCategorySpec(catId);
            if (platform.isImplemented(spec)) {
                catsAvailable.push(catId);
            }
        }

        return catsAvailable;
    }

    public fetchData(platformId: string, categoryId: string,
                     start: string, end: string) {
        let platform = this.getPlatform(platformId);
        if (!platform) {
            return;
        }

        let spec = this.ehr.getCategorySpec(categoryId);
        let category: Category = this.getCategory(categoryId);
        if (!category) {
            category = {
                "spec": spec,
                "raw": null,
                "processed": null,
            };
            this.categories.push(category);
        }

        // TODO merge to current raw (or use list of raws?)
        category.raw = platform.getData(categoryId, spec.data, start, end);
        category.processed = {
            "data" : category.raw,
            "states" : null
        };
    }

    public getData(categoryId:string): ProcessedData {
        let cat = this.getCategory(categoryId);
        if (cat) {
            return cat.processed;
        } else {
            return null;
        }
    }

    public sendData() {
        // TODO authenticate
        this.ehr.sendData(this.categories)
    }
}
