/**
 * Created by S.Angel on 4/2/2017.
 */
import { Injectable } from '@angular/core';
import {Api} from "services/api/api.service";

@Injectable()
export class TranslationService {
    constructor(
      private api: Api,
    ) {

    }

    getDetail(language, namespace, projectId = 1) {
        const filter = {
            where: {
                projectId,
                language,
                namespace,
            }
        }

        return this.api.get(`/Translations?filter=${JSON.stringify(filter)}`);
    }

    getLanguages(namespace, projectId = 1) {
        const filter = {
            fields: {language: true},
            where: {
                projectId,
                namespace,
            }
        }

        return this.api.get(`/Translations?filter=${JSON.stringify(filter)}`);
    }

    addEntry(translationId, detail) {
        return this.api.post(`/Translations/${translationId}/entry`, detail);
    }

    updateEntry(translationId, detail) {
        return this.api.patch(`/Translations/${translationId}/entry`, detail);
    }

    deleteEntry(translationId, key) {
        return this.api.delete(`/Translations/${translationId}/entry/${encodeURIComponent(key)}`);
    }

    updateKey(translationId, detail) {
        return this.api.patch(`/Translations/${translationId}/key`, detail);
    }    
}
