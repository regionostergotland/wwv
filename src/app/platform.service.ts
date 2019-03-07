import { CategorySpec, DataPoint } from './shared/spec'

interface Implementation {
    category: string,
    dataTypes: string[],
}

export abstract class Platform {
    protected implemented: Implementation[] = [];

    public abstract getData(categorySpec: CategorySpec,
                            start: string, end: string): DataPoint[];

    // can be overridden to check if available for logged in user
    public isAvailable(categoryId: string): boolean {
        return this.isImplemented(categoryId);
    }

    protected isImplemented(categoryId: string): boolean {
        return this.implemented.some(e => e.category == categoryId);
    }
}
