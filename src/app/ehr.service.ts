import { Category, StateType, StateSpec,
         CategorySpec, ProcessedData } from './shared/interface'

export class Ehr {
    private categories: CategorySpec[] = [
        {
            "id" : "blood-pressure", // TODO use IDs from archetype?
            "data" : ["systolic", "diastolic"],
            "states" : [
                {
                    "id" : "position",
                    "input_type" : StateType.ENUM,
                    "enum_opts" : [ "standing", "lying" ],
                }
            ]
        },
        {
            "id" : "bodyweight",
            "data" : ["weight"],
            "states" : [],
        }
    ];

    public getCategorySpec(categoryId: string): CategorySpec {
        for (let i = 0; i < this.categories.length; i++) {
            let spec = this.categories[i];
            if (spec.id = categoryId) {
                return spec;
            }
        }
        return null;
        //return this.categories.find(e => e.id == categoryId);
    }

    public getCategories(): string[] {
        let cats = []

        for (let i = 0; i < this.categories.length; i++) {
            cats[i] = this.categories[i].id;
        }
        return cats;
    }

    public sendData(data: Category[]) {
        // TODO fill template from processedData
        console.log("sending:\n");
        console.log(data);
    }

    public authenticate() { }
}
