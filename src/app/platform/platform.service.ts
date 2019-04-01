import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataPoint } from '../ehr/ehr-types';

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

    public abstract async signIn();

    public abstract signOut(): void;

    public abstract getAvailable(): Observable<string[]>;

    protected isImplemented(categoryId: string): boolean {
        return this.implemented.some(e => e.category === categoryId);
    }

    public abstract getData(categoryId: string,
                            start: Date, end: Date): Observable<any>;

    public abstract convertData(res: any, categoryId: string): DataPoint[];
}
