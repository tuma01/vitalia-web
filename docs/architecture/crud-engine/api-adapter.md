# Adaptador de API (OpenApiCrudAdapter)

Nuestra aplicación utiliza servicios generados automáticamente por `ng-openapi-gen`. Estos servicios no siempre cumplen con una interfaz genérica uniforme. El `OpenApiCrudAdapter` soluciona esto actuando como un puente.

## El Problema
Los servicios generados tienen nombres específicos:
- `countryService.getAllCountries()`
- `userService.getUsersList()`

El motor CRUD necesita llamar siempre a `.getAll()`.

## La Solución: El Adapter
El `OpenApiCrudAdapter` recibe el servicio original y un mapa de nombres de métodos.

```typescript
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
  ) {}

  getAll(): Observable<T[]> {
    return this.service[this.methods.getAll]();
  }
  // ... resto de métodos
}
```

## Ejemplo de uso en un Config
```typescript
const service = inject(CountryService);

apiService: new OpenApiCrudAdapter<Country>(service, {
  getAll: 'getAllCountries',
  getById: 'getCountryById',
  create: 'createCountry',
  update: 'updateCountry',
  delete: 'deleteCountry'
})
```

Esto permite que el motor siga siendo genérico mientras consume servicios con nombres arbitrarios.
