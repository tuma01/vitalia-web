import { Injectable, Type } from '@angular/core';

export interface WidgetConfig {
  type: string;
  config?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root'
})
export class WidgetRegistryService {
  private registry = new Map<string, Type<any>>();

  register(type: string, component: Type<any>) {
    this.registry.set(type, component);
  }

  get(type: string): Type<any> | undefined {
    return this.registry.get(type);
  }
}
