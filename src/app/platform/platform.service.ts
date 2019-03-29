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
    protected available: string[] = [];

    public abstract signIn(): void;

    public abstract signOut(): void;

    // can be overridden to check if available for logged in user
    public abstract isAvailable(categoryId: string): Observable<boolean>;


    protected isImplemented(categoryId: string): boolean {
        return this.implemented.some(e => e.category === categoryId);
    }

    public abstract getData(categoryId: string,
                            start: Date, end: Date): Observable<any>;

    public abstract convertData(res: any, categoryId: string): DataPoint[];
}
