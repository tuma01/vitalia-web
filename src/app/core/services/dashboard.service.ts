import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardConfig } from '../models/dashboard.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    constructor(private http: HttpClient) { }

    loadDashboard(role: string): Observable<DashboardConfig> {
        // In a real scenario, this would be: /api/dashboard/${role}
        // For now, we simulate using local assets
        const simulatedRole = role.toLowerCase().replace('_', '-');
        return this.http.get<DashboardConfig>(`assets/dashboards/${simulatedRole}-dashboard.json`);
    }
}
