import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CustomValidators} from "ng2-validation";

import {SettingsService} from "services/settings/settings.service";
import {ClientApiService} from "services/api/clientapi.service";

@Component({
    selector: 'app-register-page',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    registerForm: FormGroup;
    registerResult = 0;
    
    constructor(
        public router: Router,
        private fb: FormBuilder,
        private api: ClientApiService,
        private settings: SettingsService
    ) { 
        const password = new FormControl('', Validators.compose([Validators.required]));
        const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

        this.registerForm = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            password,
            confirmPassword,
        });
    }

    ngOnInit() {
        this.registerResult = 0;
    }

    register($event) {
        $event.preventDefault();

        for (let c in this.registerForm.controls) {
            this.registerForm.controls[c].markAsTouched();
        }
        if (!this.registerForm.valid) return;

        this.api.register(this.registerForm.value).subscribe(res => {
            this.settings.setStorage('token', res.token);
            this.registerResult = 1;
            // this.router.navigate(['/dashboard']);
        }, err => {
            this.registerResult = 2;
        });
    }
}
