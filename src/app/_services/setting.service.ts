import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { APP_CONFIG, AppConfig } from '../app.config';


import { AuthenticationService } from './authentication.service';

import { User } from '../_models/index';

@Injectable()
export class SettingService {
    private token: string;
    private headers: Headers;
    private options: RequestOptions;

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService,
        @Inject(APP_CONFIG) private config: AppConfig
    ) {
        this.headers = new Headers();
        this.options = new RequestOptions();
    }
    private setHeaders(): void {
        this.headers.delete('Content-Type');
        this.headers.delete('Accept');
        this.headers.delete('Authorization');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + this.authenticationService.token);
        this.options = new RequestOptions({ headers: this.headers });
    }
    private url = this.config.apiEndpoint;
    private getSettingUrl = this.url + '/api/a/settings';
    


    getSetting(): Observable<any> {
        this.setHeaders();
        return this.http.get(`${this.getSettingUrl}`, this.options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
    updateSetting(data): Observable<any> {
        this.setHeaders();
        return this.http.put(`${this.getSettingUrl}`, data, this.options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }
    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }


}