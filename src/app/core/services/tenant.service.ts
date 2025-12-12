import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { TenantManagementControllerService } from "../../api/services";
import { TenantResponseExtended } from "../models/tenant-response-extended.model";

@Injectable({ providedIn: 'root' })
export class TenantService {
  private tenant: TenantResponseExtended  | null = null;

  constructor(private tenantApi: TenantManagementControllerService) {}

  loadTenant(id: string): Observable<TenantResponseExtended> {
    return this.tenantApi.getTenant({ id: Number(id) }).pipe(
      map(t => ({ ...t, activeFeatures: (t as any)['activeFeatures'] ?? [] })), // asegura activeFeatures
      tap(t => this.tenant = t)
    );
  }

  getActiveFeatures(): string[] {
    return this.tenant?.activeFeatures ?? [];
  }

  getTenant(): TenantResponseExtended  | null {
    return this.tenant;
  }
}
