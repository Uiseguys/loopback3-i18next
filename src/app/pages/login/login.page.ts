import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

import {SettingsService} from "services/settings/settings.service";
import {ClientApiService} from "services/api/clientapi.service";

@Component({
    selector: 'app-login-page',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    loginError:string = '';
    
    constructor(
        public router: Router,
        private fb: FormBuilder,
        private api: ClientApiService,
        private settings: SettingsService
    ) { 
        this.loginForm = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'password': ['', Validators.compose([Validators.required])],
        });
        
        this.loginForm.controls['email'].setValue('admin@admin.com');
        this.loginForm.controls['password'].setValue('admin123');

        if (this.settings.getStorage('token')) {
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
        
    }

    login($event) {
        $event.preventDefault();

        for (let c in this.loginForm.controls) {
            this.loginForm.controls[c].markAsTouched();
        }
        if (!this.loginForm.valid) return;

        this.api.login(this.loginForm.value).subscribe(res => {
            this.settings.setStorage('token', res.id);
            this.settings.setStorage('userId', res.userId);
            this.router.navigate(['/dashboard']);
        }, err => {
            this.loginError = 'Error occured while connecting to a server';
        });
    }
}
