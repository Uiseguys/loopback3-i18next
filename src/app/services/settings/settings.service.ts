import {EventEmitter, Injectable} from '@angular/core';

import {environment as ENV} from "../../../environments/environment";

@Injectable()
export class SettingsService {

    public user: any;
    public app: any;
    public layout: any;
    public API_URL = ENV.apiUrl;
    public FILE_URL = ENV.apiUrl + '/attachments/all/download/';

    public toastEvent = new EventEmitter<Object>();

    constructor() {

        // User Settings
        // -----------------------------------
        this.user = {};

        // App Settings
        // -----------------------------------
        this.app = {
            name: 'stanapp',
            user: {roles: []},
            year: ((new Date()).getFullYear())
        };
    }

    getAppSetting(name) {
        return name ? this.app[name] : this.app;
    }
    getUserSetting(name) {
        return name ? this.user[name] : this.user;
    }
    getLayoutSetting(name) {
        return name ? this.layout[name] : this.layout;
    }

    setAppSetting(name, value, save?) {
        this.app[name] = value;
        if (save) {
            this.setStorage('app-' + name, value);
        }
    }

    setUserSetting(name, value) {
        this.user[name] = value;
    }

    clearSetting() {
        this.removeStorage('userId');
        this.removeStorage('token');
    }

    getStorage (key, defaultVal?) {
        try {
            return window.localStorage[this.app.name + key] ?
            JSON.parse(window.localStorage[this.app.name + key]) : defaultVal || false;
        } catch {

        }
        return defaultVal || false;
    };

    setStorage (key, val) {
        window.localStorage.setItem(this.app.name + key, JSON.stringify(val));
    }

    removeStorage(key) {
        window.localStorage.removeItem(this.app.name + key);
    }

    getToastEvent() {
        return this.toastEvent;
    }
}
