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

    public sendData(categories: Category[]) {
        // TODO modify for actual template
        let template: any = {
            "ctx": {
                "language": "sv",
                "territory": "SE",
            },
            "self_monitor": {
                "self_monitor": []
            }
        };

        for (let i = 0; i < categories.length; i++) {
            let cat = categories[i];

            let arch: any = {};
            arch.time = cat.processed.raw.time;
            for (let j = 0; j < cat.processed.raw.data.length; j++) {
                let data = cat.processed.raw.data[j];
                arch[data.id] = data.values;
            }

            for (let j = 0; j < cat.processed.states.length; j++) {
                let state = cat.processed.states[j];
                arch[state.id] = state.input;
            }

            let template_cat: any = {};
            template_cat[cat.spec.id] = [
                { "any_event" : [ arch ] }
            ];

            template.self_monitor.self_monitor.push(template_cat);
        }

        console.log("sending:");
        console.log(JSON.stringify(template, null, 2));
    }

    public authenticate() { }
}
