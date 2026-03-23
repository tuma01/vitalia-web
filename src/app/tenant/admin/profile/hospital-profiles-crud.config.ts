import { inject } from '@angular/core';
import { TenantConfig } from 'app/api/models/tenant-config';
import { TenantConfigService } from 'app/api/services/tenant-config.service';
import { OpenApiCrudAdapter } from '@shared/services/crud-api-adapter.service';
import { CrudConfig } from '@shared/components/crud-template/crud-config';

export const HOSPITAL_PROFILES_CRUD_CONFIG = (): CrudConfig<TenantConfig> => {
    const service = inject(TenantConfigService);

    return {
        entityName: 'tenant_admin.admin.profile.singular',
        entityNamePlural: 'tenant_admin.admin.profile.plural',

        getId: (entity: TenantConfig) => entity.id!,

        apiService: new OpenApiCrudAdapter<TenantConfig>(service, {
            getAll: 'getPaginatedTenantConfigs',
            getById: 'getTenantConfigById',
            create: 'createTenantConfig',
            update: 'updateTenantConfig',
            delete: 'deleteTenantConfig'
        }),

        columns: [],

        form: {
            layout: { 
                mode: 'tabs',
                columns: 2
            },
            fields: [
                // --- PESTAÑA 1: IDENTIDAD & MARCA ---
                {
                    name: 'tenantName',
                    label: 'tenant_admin.admin.profile.fields.tenantName',
                    sectionTitle: 'tenant_admin.admin.profile.sections.identity',
                    sectionIcon: 'domain',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    icon: 'account_balance'
                },
                {
                    name: 'slogan',
                    label: 'tenant_admin.admin.profile.fields.slogan',
                    type: 'text',
                    colSpan: 1,
                    icon: 'auto_awesome'
                },
                {
                    name: 'tenantDescription',
                    label: 'tenant_admin.admin.profile.fields.tenantDescription',
                    type: 'text',
                    colSpan: 2,
                    icon: 'description'
                },
                {
                    name: 'logoUrl',
                    label: 'tenant_admin.admin.profile.fields.logoUrl',
                    type: 'text',
                    colSpan: 1,
                    icon: 'image'
                },
                {
                    name: 'faviconUrl',
                    label: 'tenant_admin.admin.profile.fields.faviconUrl',
                    type: 'text',
                    colSpan: 1,
                    icon: 'shutter_speed'
                },
                {
                    name: 'sealUrl',
                    label: 'tenant_admin.admin.profile.fields.sealUrl',
                    type: 'text',
                    colSpan: 2,
                    icon: 'approval'
                },

                // --- PESTAÑA 2: LEGAL & FISCAL ---
                {
                    name: 'legalName',
                    label: 'tenant_admin.admin.profile.fields.legalName',
                    sectionTitle: 'tenant_admin.admin.profile.sections.legal',
                    sectionIcon: 'gavel',
                    type: 'text',
                    required: true,
                    colSpan: 2,
                    icon: 'business'
                },
                {
                    name: 'taxId',
                    label: 'tenant_admin.admin.profile.fields.taxId',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    icon: 'badge'
                },
                {
                    name: 'medicalLicense',
                    label: 'tenant_admin.admin.profile.fields.medicalLicense',
                    type: 'text',
                    required: true,
                    colSpan: 1,
                    icon: 'verified_user'
                },
                {
                    name: 'medicalDirector',
                    label: 'tenant_admin.admin.profile.fields.medicalDirector',
                    type: 'text',
                    colSpan: 1,
                    icon: 'person'
                },
                {
                    name: 'medicalDirectorLicense',
                    label: 'tenant_admin.admin.profile.fields.medicalDirectorLicense',
                    type: 'text',
                    colSpan: 1,
                    icon: 'card_membership'
                },

                // --- PESTAÑA 3: CAPACIDAD OPERATIVA ---
                {
                    name: 'hospitalCategory',
                    label: 'tenant_admin.admin.profile.fields.hospitalCategory',
                    sectionTitle: 'tenant_admin.admin.profile.sections.operational',
                    sectionIcon: 'medical_services',
                    type: 'text',
                    colSpan: 2,
                    icon: 'stars'
                },
                {
                    name: 'bedCapacity',
                    label: 'tenant_admin.admin.profile.fields.bedCapacity',
                    type: 'number',
                    colSpan: 1,
                    icon: 'bed'
                },
                {
                    name: 'operatingRoomsCount',
                    label: 'tenant_admin.admin.profile.fields.operatingRoomsCount',
                    type: 'number',
                    colSpan: 1,
                    icon: 'biotech'
                },
                {
                    name: 'emergency247',
                    label: 'tenant_admin.admin.profile.fields.emergency247',
                    type: 'checkbox',
                    colSpan: 2
                },

                // --- PESTAÑA 4: CONTACTO & REDES ---
                {
                    name: 'contactPhone',
                    label: 'tenant_admin.admin.profile.fields.contactPhone',
                    sectionTitle: 'tenant_admin.admin.profile.sections.contact',
                    sectionIcon: 'contact_phone',
                    type: 'text',
                    colSpan: 1,
                    icon: 'phone'
                },
                {
                    name: 'whatsappNumber',
                    label: 'tenant_admin.admin.profile.fields.whatsappNumber',
                    type: 'text',
                    colSpan: 1,
                    icon: 'chat'
                },
                {
                    name: 'contactEmail',
                    label: 'tenant_admin.admin.profile.fields.contactEmail',
                    type: 'text',
                    colSpan: 1,
                    icon: 'email'
                },
                {
                    name: 'faxNumber',
                    label: 'tenant_admin.admin.profile.fields.faxNumber',
                    type: 'text',
                    colSpan: 1,
                    icon: 'fax'
                },
                {
                    name: 'website',
                    label: 'tenant_admin.admin.profile.fields.website',
                    type: 'text',
                    colSpan: 1,
                    icon: 'public'
                },
                {
                    name: 'socialLinks',
                    label: 'tenant_admin.admin.profile.fields.socialLinks',
                    type: 'text',
                    colSpan: 1,
                    icon: 'share'
                },

                // --- PESTAÑA 5: UBICACIÓN (GEO) ---
                {
                    name: 'address',
                    label: 'tenant_admin.admin.profile.sections.location',
                    sectionTitle: 'tenant_admin.admin.profile.sections.location',
                    sectionIcon: 'location_on',
                    type: 'address',
                    colSpan: 2
                },

                // --- PESTAÑA 6: SUSCRIPCIÓN & CONFIG ---
                {
                    name: 'subscriptionPlan',
                    label: 'tenant_admin.admin.profile.fields.subscriptionPlan',
                    sectionTitle: 'tenant_admin.admin.profile.sections.subscription',
                    sectionIcon: 'card_membership',
                    type: 'select',
                    colSpan: 2,
                    options: [
                        { label: 'TRIAL', value: 'TRIAL' },
                        { label: 'BASIC', value: 'BASIC' },
                        { label: 'PREMIUM', value: 'PREMIUM' },
                        { label: 'ENTERPRISE', value: 'ENTERPRISE' }
                    ],
                    icon: 'military_tech',
                    disabled: true
                },
                {
                    name: 'onboardingDate',
                    label: 'tenant_admin.admin.profile.fields.onboardingDate',
                    type: 'date',
                    colSpan: 1,
                    icon: 'calendar_today',
                    disabled: true
                },
                {
                    name: 'expirationDate',
                    label: 'tenant_admin.admin.profile.fields.expirationDate',
                    type: 'date',
                    colSpan: 1,
                    icon: 'event_busy',
                    disabled: true
                },
                {
                    name: 'timezone',
                    label: 'tenant_admin.admin.profile.fields.timezone',
                    sectionTitle: 'tenant_admin.admin.profile.sections.technical',
                    sectionIcon: 'settings',
                    type: 'select',
                    colSpan: 1,
                    options: [],
                    icon: 'access_time'
                },
                { name: 'locale', label: 'tenant_admin.admin.profile.fields.locale', type: 'select', colSpan: 1, options: [], icon: 'translate' },
                {
                    name: 'defaultDomain',
                    label: 'tenant_admin.admin.profile.fields.defaultDomain',
                    type: 'text',
                    required: true,
                    colSpan: 2,
                    icon: 'dns'
                },
                { name: 'requireEmailVerification', label: 'tenant_admin.admin.profile.fields.requireEmailVerification', type: 'checkbox', colSpan: 1 },
                {
                    name: 'maxUsers',
                    label: 'tenant_admin.admin.profile.fields.maxUsers',
                    type: 'number',
                    colSpan: 1,
                    icon: 'people',
                    disabled: true
                },
                { name: 'storageQuotaBytes', label: 'tenant_admin.admin.profile.fields.storageQuotaBytes', type: 'number', colSpan: 1, icon: 'storage', disabled: true }
            ]
        },

        enableEdit: true,
        enableAdd: false,
        enableDelete: false
    };
};
