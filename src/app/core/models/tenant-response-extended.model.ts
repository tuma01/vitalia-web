import { TenantResponse } from "../../api/models";

export interface TenantResponseExtended extends TenantResponse {
  activeFeatures?: string[];
}
