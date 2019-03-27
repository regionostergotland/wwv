import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataPoint } from '../shared/spec';

interface Implementation {
    category: string;
    dataTypes: string[];
}

@Injectable({
    providedIn: 'root',
})
export abstract class Platform {
    protected implemented: Implementation[] = [];

    public abstract getData(categoryId: string,
                            start: Date, end: Date): Observable<DataPoint[]>;

    // can be overridden to check if available for logged in user
    public isAvailable(categoryId: string): boolean {
        return this.isImplemented(categoryId);
    }

    protected isImplemented(categoryId: string): boolean {
        return this.implemented.some(e => e.category === categoryId);
    }
}
