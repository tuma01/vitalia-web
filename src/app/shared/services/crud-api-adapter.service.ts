import { Observable, map } from 'rxjs';
import { CrudApiService } from '../components/crud-template/crud-config';

/**
 * Adapter to wrap OpenApi generated services into the generic CrudApiService interface.
 */
export class OpenApiCrudAdapter<T> implements CrudApiService<T> {
    constructor(
        private service: any,
        private methods: {
            getAll: string;
            getById: string;
            create: string;
            update: string;
            delete: string;
        }
    ) { }

    getAll(): Observable<T[]> {
        return this.service[this.methods.getAll]();
    }

    getById(id: any): Observable<T> {
        return this.service[this.methods.getById]({ id });
    }

    create(entity: T): Observable<T> {
        return this.service[this.methods.create]({ body: entity });
    }

    update(id: any, entity: T): Observable<T> {
        return this.service[this.methods.update]({ id, body: entity });
    }

    delete(id: any): Observable<void> {
        return this.service[this.methods.delete]({ id });
    }
}
