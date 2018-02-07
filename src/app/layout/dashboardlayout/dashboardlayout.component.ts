import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {ToasterConfig} from 'angular2-toaster';

import {SettingsService} from "../../services/settings/settings.service";
import {ClientApiService} from "../../services/api/clientapi.service";

@Component({
    selector: 'app-dashboardlayout',
    templateUrl: './dashboardlayout.component.html',
    styleUrls: ['./dashboardlayout.component.scss'],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
    user = {email: '', roles: []};
    toasterconfig = new ToasterConfig({
        showCloseButton: false, 
        tapToDismiss: false, 
        timeout: 2000,
    });

    constructor(
        private router: Router,
        private settings: SettingsService,
        private api: ClientApiService,
    ) {
        this.user = settings.getAppSetting('user');        
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    logout($event) {
        $event.preventDefault();
        this.api.logout().subscribe(() => {
            this.settings.clearSetting();
            this.router.navigate(['/home']);
        });
    }
}
