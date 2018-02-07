
import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import {SelectModule} from 'ng2-select';
import {ToasterService} from 'angular2-toaster';
import {NgxPaginationModule} from 'ngx-pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import {AuthGuardResolve} from 'services/authguard/authguard.service';
import {ServicesModule} from 'services/services.module';
import {LayoutModule} from 'layout/layout.module';
import {DashboardLayoutComponent} from 'layout/dashboardlayout/dashboardlayout.component';
import {LoginPage} from './login/login.page';
import {RegisterPage} from './register/register.page';

import {ProjectService} from './project/project.service';
import {ProjectPage} from './project/project.page';

import {TranslationService} from './translation/translation.service';
import {TranslationPage} from './translation/translation.page';

export const routes = [
    {
        path: 'login',
        component: LoginPage,
        canActivate: [AuthGuardResolve],
    },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,        
        resolve: {
            user: AuthGuardResolve
        },
        children: [
            { path: '', redirectTo: 'languages', pathMatch: 'full' },
            
            { path: 'languages', component: ProjectPage },
            { path: 'translation/:language/:namespace', component: TranslationPage },
        ]
    },
    { path: '**', redirectTo: 'login' }
    // Not found
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        FileUploadModule,
        SelectModule,
        NgxPaginationModule,
        LayoutModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
      LoginPage,
      RegisterPage,

      ProjectPage,
      TranslationPage,
    ],
    providers: [
        ToasterService,
        ProjectService,
        TranslationService,
    ],
    exports: [
        RouterModule,
    ]
})
export class PagesModule {

}
