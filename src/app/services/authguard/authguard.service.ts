/**
 * Created by Tall Prince on 5/27/2017.
 */
import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot, CanLoad, Route, CanActivate
} from '@angular/router';
import {Observable} from "rxjs";

import {ClientApiService} from "services/api/clientapi.service";
import {SettingsService} from "services/settings/settings.service";

@Injectable()
export class AuthGuardResolve implements Resolve<any>, CanLoad, CanActivate {
    constructor(
        private router: Router,
        private settings: SettingsService,
        private api: ClientApiService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        // check role
        return new Promise((resolve, reject) => {

            if (this.settings.getStorage('token') && this.settings.getStorage('userId')) {
                this.api.getUserInfo(this.settings.getStorage('userId')).subscribe((res) => {
                    if (res.roles) {
                        res.roles = res.roles.map(item => item.name);
                    }
                    res.token = this.settings.getStorage('token');
                    this.settings.setAppSetting('user', res);
                    resolve(res);
                }, (err) => {
                    this.settings.clearSetting();
                    this.router.navigate(['/login']);
                });
            } else {
                this.settings.clearSetting();
                reject('Permission denied');
                this.router.navigate(['/login']);
            }
        });
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return true;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean
        | Observable<boolean>
        | Promise<boolean> {

        console.log('okay...');
        if (this.settings.getStorage('token') && this.settings.getStorage('userId')) {
            this.router.navigate(['/dashboard']);
            return false;
        }
        return true;
    }

}