/**
 * Created by Tall Prince on 5/26/2017.
 */
import {Injectable} from '@angular/core';
import {Http, Headers, URLSearchParams } from '@angular/http';
import {Observable} from "rxjs";
import {Router} from "@angular/router";

import {environment as ENV} from "../../../environments/environment";
import {SettingsService} from "../settings/settings.service";

@Injectable()
export class Api {

    constructor(
        private http: Http,
        private router: Router,
        protected settings: SettingsService
    ) {

    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', this.settings.getStorage('token'));
    }

    get(url, data?) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        let params: URLSearchParams = new URLSearchParams();
        if (data) {
            for (var key in data) {
                params.set(key, data[key]);
            }
        }

        return this.http.get(ENV.apiUrl + url, {
            headers: headers,
            search: params
        }).map(res => res.json()).catch(this.handleError);
    }

    post(url, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.post(ENV.apiUrl + url, data, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    put(url, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.put(ENV.apiUrl + url, data, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    patch(url, data) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.patch(ENV.apiUrl + url, data, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    delete(url) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        return this.http.delete(ENV.apiUrl + url, {
            headers: headers
        }).map(res => res.json()).catch(this.handleError);
    }

    private handleError (error: any) {
        if((error.status == 401 || error.status == 400) && error.url && !error.url.endsWith('/login')) {
            if (this.settings) this.settings.clearSetting();
            document.location.href="/";
        }
        // In a real world app, you might use a remote logging infrastructure

        return Observable.throw(error);
    }
}