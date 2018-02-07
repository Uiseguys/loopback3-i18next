import { NgModule } from '@angular/core';
import {SettingsService} from "./settings/settings.service";
import {Api} from "./api/api.service";
import {ClientApiService} from "./api/clientapi.service";
import {AuthGuardResolve} from "./authguard/authguard.service";

@NgModule({
    imports: [
    ],
    providers: [
        SettingsService,
        Api,
        ClientApiService,
        AuthGuardResolve,
    ],
    declarations: [

    ],
    exports: [

    ]
})
export class ServicesModule { }
