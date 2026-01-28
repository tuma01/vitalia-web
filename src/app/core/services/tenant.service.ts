import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { TenantService as TenantApiService } from "../../api/services/tenant.service";
import { Tenant } from "../../api/models/tenant";
import { UiConfigService } from "../../shared/ui/config/ui-config.service";

@Injectable({ providedIn: 'root' })
export class TenantService {
  private tenant: Tenant | null = null;

  constructor(
    private tenantApi: TenantApiService,
    private uiConfig: UiConfigService
  ) { }

  loadTenant(id: string): Observable<Tenant> {
    return this.tenantApi.getTenantById({ id: Number(id) }).pipe(
      tap(t => {
        this.tenant = t;
        // Simulación: Si el tenant tiene un tema (aun si viene como themeId) 
        // aquí llamaríamos a la API de temas y lo setearíamos:
        // this.themeApi.getById(t.themeId).subscribe(theme => this.uiConfig.tenantTheme.set(theme));
      })
    );
  }

  getTenant(): Tenant | null {
    return this.tenant;
  }

  // Método requerido por MenuService
  getActiveFeatures(): string[] {
    // Por ahora retornamos array vacío, se puede extender después
    return [];
  }
}
