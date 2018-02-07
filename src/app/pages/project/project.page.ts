import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from 'rxjs/Observable';
import {ToasterService} from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { groupBy } from 'lodash';

import {ProjectService} from "./project.service";
import languageList from './languages';

@Component({
    selector: 'app-project-page',
    templateUrl: './project.page.html',
    styleUrls: ['./project.page.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectPage implements OnInit {
    
    languages = [];
    detail = {};

    languageList = [];
    languageForm;
    languageModalRef;

    namespaceForm;
    namespaceModalRef;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public router: Router,
        private api: ProjectService,
        private toasterService: ToasterService,
        private modalService: BsModalService,
    ) { 
        this.languageList = languageList.map(item => ({
            id: item.code,
            text: `${item.name} (${item.nativeName})`
        }));

        this.languageForm = fb.group({
            'language': ['', Validators.compose([Validators.required])],
        });  
        
        this.namespaceForm = fb.group({
            'namespace': ['', Validators.compose([Validators.required])],
        }); 
    }

    ngOnInit() {
        this.api.getDetail().subscribe(res => {
            this.detail = groupBy(res, item => item.language);
            this.languages = Object.keys(this.detail);
        });
    }

    showLanguageForm(template) {
        this.languageForm.reset({});
        this.languageModalRef = this.modalService.show(template);
    }

    addLanguage($event) {
        $event.preventDefault();

        for (let c in this.languageForm.controls) {
            this.languageForm.controls[c].markAsTouched();
        }
        if (!this.languageForm.valid) return;

        // check duplicate
        const { language } = this.languageForm.value;
        if (this.languages.indexOf(language) !== -1) {
            this.toasterService.pop('error', '', 'This language is already added');    
            return;
        }

        this.api.addLanguage(language).subscribe(res => {
            // add keys
            this.detail[language] = res;
            this.languages.push(language);
            this.languageModalRef.hide();
            this.toasterService.pop('success', '', 'Language is added');    
        });
    }

    onLanguageSelected(value) {
        this.languageForm.controls['language'].setValue(value.id);
    }

    editLanguage(language, namespace) {
        this.router.navigate(['/dashboard/translation', language, namespace ]);
    }

    showNamespaceForm(template) {
        this.namespaceForm.reset({});
        this.namespaceModalRef = this.modalService.show(template);
    }

    addNamespace($event) {
        $event.preventDefault();

        for (let c in this.namespaceForm.controls) {
            this.namespaceForm.controls[c].markAsTouched();
        }
        if (!this.namespaceForm.valid) return;

        // check duplicate
        const { namespace } = this.namespaceForm.value;
        this.api.addNamespace(namespace).subscribe(res => {
            // add new namespaces for all languages
            this.languages.forEach((language) => {
                this.detail[language].push({
                    language,
                    namespace,
                });
            });

            this.namespaceModalRef.hide();
            this.toasterService.pop('success', '', 'Namespace is added');    
        }, res => {
            const error = JSON.parse(res._body);
            this.toasterService.pop('error', '', (error.error && error.error.message) || 'Sorry, something is wrong');
        });
    }
}
