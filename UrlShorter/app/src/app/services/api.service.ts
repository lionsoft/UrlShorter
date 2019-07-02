import { Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

export class ApiService {

    constructor(private http: HttpClient) {
        
    }

    resolve$(hash: string): Observable<string> {
        return this.http.get<string>(`api/${encodeURIComponent(hash)}`);
    }
    resolve(hash: string): Promise<string> {
        return this.resolve$(hash).toPromise();
    }

    make$(url: string): Observable<string> {
        return this.http.post<string>(`api`, url).pipe(flatMap(x => {
            return of(`${location.origin}/${x}`);
        }));
    }
    make(url: string): Promise<string> {
        return this.make$(url).toPromise();
    }

    edit$(hash: string, url: string): Observable<boolean> {
        return this.http.put<boolean>(`api/${encodeURIComponent(hash)}`, url);
    }
    edit(hash: string, url: string): Promise<boolean> {
        return this.edit$(hash, url).toPromise();
    }

    delete$(hash: string): Observable<boolean> {
        return this.http.delete<boolean>(`api/${encodeURIComponent(hash)}`);
    }
    delete(hash: string): Promise<boolean> {
        return this.delete$(hash).toPromise();
    }
}

