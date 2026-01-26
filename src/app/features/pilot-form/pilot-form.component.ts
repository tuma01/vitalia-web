import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import {
  UiConfigService,
  UiButtonComponent,
  UiIconButtonComponent,
  UiInputComponent,
  UiFormFieldComponent,
  UiErrorDirective,
  UiPrefixDirective,
  UiSuffixDirective,
  UiSelectComponent,
  UiDataTableComponent,
  UiTableColumn,
  UiTableAction,
  UiProgressSpinnerComponent,
  UiProgressBarComponent,
  UiTabGroupComponent,
  UiTabComponent,
  UiAccordionComponent,
  UiExpansionPanelComponent,
  UiTagComponent,
  UiBadgeComponent,
  UiDatepickerComponent,
  UiTimepickerComponent,
  UiToolbarComponent,
  UiBreadcrumbsComponent,
  UiBreadcrumbItem,
  UiSidenavComponent,
  UiSidenavItem,
  UiStepperComponent,
  UiCardComponent,
  UiCardHeaderComponent,
  UiCardContentComponent,
  UiCardFooterComponent,
  UiCardTitleDirective,
  UiCardSubtitleDirective,
  UiCheckboxComponent,
  UiRadioGroupComponent,
  UiRadioButtonComponent,
  UiToggleComponent,
  UiDialogService,
  UiToastService
} from '@ui';
import { ZoneRendererComponent } from '../../layout/zones/zone-renderer.component';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';
import { PilotFormWidgetComponent } from '../../widgets/pilot-form-widget/pilot-form-widget.component';

interface PilotUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-pilot-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatStepperModule,
    UiButtonComponent,
    UiIconButtonComponent,
    UiInputComponent,
    UiFormFieldComponent,
    UiPrefixDirective,
    UiSuffixDirective,
    UiSelectComponent,
    UiDataTableComponent,
    UiProgressSpinnerComponent,
    UiProgressBarComponent,
    UiTabGroupComponent,
    UiTabComponent,
    UiAccordionComponent,
    UiExpansionPanelComponent,
    UiTagComponent,
    UiBadgeComponent,
    UiDatepickerComponent,
    UiTimepickerComponent,
    UiToolbarComponent,
    UiBreadcrumbsComponent,
    UiSidenavComponent,
    UiStepperComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
    UiCardTitleDirective,
    UiCardSubtitleDirective,
    UiCheckboxComponent,
    UiRadioGroupComponent,
    UiRadioButtonComponent,
    UiToggleComponent,
    ZoneRendererComponent,
    TitleCasePipe
  ],
  templateUrl: './pilot-form.component.html',
  styles: [`
    :host {
      display: block;
      padding: var(--ui-space-xl);
      background-color: var(--ui-background-default);
      transition: background-color 0.3s ease;
      min-height: 100vh;
    }
    
    .pilot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ui-space-xl);
      max-width: 1400px;
      margin: 0 auto;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
    
    .pilot-card {
      padding: var(--ui-space-xl);
      border-radius: var(--ui-radius-lg);
      background: #fff;
      box-shadow: var(--ui-elevation-lg);
      border: 1px solid var(--ui-color-border, #eee);
    }

    .pilot-header {
      margin-bottom: var(--ui-space-lg);
      text-align: center;
      grid-column: 1 / -1;

      h2 {
        margin: 0;
        color: var(--ui-color-text);
        font-family: var(--ui-font-family-sans);
        font-weight: var(--ui-font-weight-bold);
      }
      
      p {
        margin-top: var(--ui-space-xs);
        color: var(--ui-color-text-secondary);
      }
    }

    .pilot-actions {
      display: flex;
      gap: var(--ui-space-md);
      margin-bottom: var(--ui-space-lg);
      justify-content: center;
      grid-column: 1 / -1;
    }

    .section-title {
        margin-top: 0;
        margin-bottom: var(--ui-space-md);
        color: var(--ui-color-primary);
        font-size: 1.2rem;
    }
  `]
})
export class PilotFormComponent implements OnInit {
  form: FormGroup;
  // Phase 1 Examples
  breadcrumbItems: UiBreadcrumbItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/' },
    { label: 'Users', icon: 'people', link: '/users' },
    { label: 'Pilot Test', link: '/pilot' }
  ];

  sidenavItems: UiSidenavItem[] = [
    { id: '1', label: 'Inicio', icon: 'home', route: '/' },
    {
      id: '2',
      label: 'Pacientes',
      icon: 'medication',
      badge: 12,
      children: [
        { id: '2-1', label: 'Listado Total', icon: 'list', route: '/patients/list' },
        { id: '2-2', label: 'Ingresos Hoy', icon: 'add_circle', badge: 3, badgeColor: 'warn' },
        { id: '2-3', label: 'Reportes Médicos', icon: 'description' }
      ]
    },
    { id: '3', label: 'Citas', icon: 'calendar_month' },
    {
      id: '4',
      label: 'Configuración',
      icon: 'settings',
      children: [
        { id: '4-1', label: 'Perfil', icon: 'person' },
        { id: '4-2', label: 'Seguridad', icon: 'security' },
        { id: '4-3', label: 'Notificaciones', icon: 'notifications' }
      ]
    }
  ];

  stepperLinear = false;
  isSaving = false;
  activeSidenavId = '2';

  registry = inject(WidgetRegistryService);
  private toastService = inject(UiToastService);
  private fb = inject(FormBuilder);
  public uiConfig = inject(UiConfigService);
  private dialogService = inject(UiDialogService);

  showSuccessToast() {
    this.toastService.success('El paciente ha sido registrado correctamente.', 'Operación Exitosa');
  }

  showErrorToast() {
    this.toastService.error('Hubo un problema al conectar con el servidor de Vitalia.', 'Error de Sistema');
  }

  showInfoToast() {
    this.toastService.info('Tienes una nueva actualización de software disponible.', 'Información');
  }

  showWarningToast() {
    this.toastService.warning('Tu sesión expirará en 5 minutos por inactividad.', 'Advertencia de Seguridad');
  }
  zoneWidgets = [
    {
      type: 'pilot-form-widget',
      config: {
        title: 'Dynamic Contact Widget',
        fields: ['Contact Name', 'Phone Number'],
        variant: 'compact'
      }
    },
    {
      type: 'pilot-form-widget',
      config: {
        title: 'Feedback Widget',
        fields: ['Subject', 'Message', 'Email'],
        variant: 'default'
      }
    }
  ];

  // Table Data
  tableData: any[] = [
    { id: 1, name: 'John Doe', email: 'john@vitalia.com', role: 'Admin', status: 'Active', salary: 45000, avatar: 'https://i.pravatar.cc/150?u=1', platform: 'Windows', platformIcon: 'desktop_windows', bio: 'Experienced administrator with a focus on system integrity and user management.' },
    { id: 2, name: 'Jane Smith', email: 'jane@school.com', role: 'Doctor', status: 'Active', salary: 75000, avatar: 'https://i.pravatar.cc/150?u=2', platform: 'MacOS', platformIcon: 'desktop_mac', bio: 'Senior surgeon specializing in minimally invasive procedures and medical research.' },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'Patient', status: 'Inactive', salary: 0, avatar: 'https://i.pravatar.cc/150?u=3', platform: 'Linux', platformIcon: 'computer', bio: 'Regular patient following a long-term rehabilitation program for sports injuries.' },
    { id: 4, name: 'Alice Williams', email: 'alice@vitalia.com', role: 'Nurse', status: 'Active', salary: 38000, avatar: 'https://i.pravatar.cc/150?u=4', platform: 'iOS', platformIcon: 'phone_iphone', bio: 'Pediatric nurse dedicated to providing compassionate care for children and families.' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@vitalia.com', role: 'Employee', status: 'Active', salary: 32000, avatar: 'https://i.pravatar.cc/150?u=5', platform: 'Android', platformIcon: 'phone_android', bio: 'Logistics coordinator managing supply chains and medical equipment distribution.' },
    { id: 6, name: 'David Wilson', email: 'david@vitalia.com', role: 'Patient', status: 'Active', salary: 0, avatar: 'https://i.pravatar.cc/150?u=6', platform: 'Web', platformIcon: 'public', bio: 'Outpatient visiting for routine checkups and preventive health screenings.' },
    { id: 7, name: 'Emma Davis', email: 'emma@vitalia.com', role: 'Doctor', status: 'Inactive', salary: 72000, avatar: 'https://i.pravatar.cc/150?u=7', platform: 'Windows', platformIcon: 'desktop_windows', bio: 'Specialist in internal medicine with a passion for diagnostic excellence.' },
    { id: 8, name: 'Frank Miller', email: 'frank@vitalia.com', role: 'Admin', status: 'Active', salary: 50000, avatar: 'https://i.pravatar.cc/150?u=8', platform: 'MacOS', platformIcon: 'desktop_mac', bio: 'IT operations manager overseeing infrastructure and security protocols.' },
    { id: 9, name: 'Grace Taylor', email: 'grace@vitalia.com', role: 'Nurse', status: 'Active', salary: 41000, avatar: 'https://i.pravatar.cc/150?u=9', platform: 'iOS', platformIcon: 'phone_iphone', bio: 'Specialist in patient care and emergency response with 10 years experience.' },
    { id: 10, name: 'Henry Moore', email: 'henry@vitalia.com', role: 'Employee', status: 'Inactive', salary: 28000, avatar: 'https://i.pravatar.cc/150?u=10', platform: 'Android', platformIcon: 'phone_android', bio: 'Technical support specialist.' },
    { id: 11, name: 'Ivy Lee', email: 'ivy@vitalia.com', role: 'Admin', status: 'Active', salary: 52000, avatar: 'https://i.pravatar.cc/150?u=11', platform: 'Web', platformIcon: 'public', bio: 'Platform administrator for global operations.' },
    { id: 12, name: 'Jack White', email: 'jack@vitalia.com', role: 'Doctor', status: 'Active', salary: 81000, avatar: 'https://i.pravatar.cc/150?u=12', platform: 'MacOS', platformIcon: 'desktop_mac', bio: 'Surgical specialist and researcher.' }
  ];

  tableColumns: UiTableColumn<any>[] = [
    { key: 'name', header: 'User', type: 'avatar', imageProperty: 'avatar', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'bio', header: 'Biography (Truncated)', truncate: true, width: '200px' },
    { key: 'salary', header: 'Salary', type: 'currency', align: 'right', sortable: true },
    { key: 'status', header: 'Status', type: 'badge' }
  ];

  tableActions: UiTableAction<PilotUser>[] = [
    {
      id: 'edit',
      icon: 'edit',
      tooltip: 'Editar usuario',
      action: (row) => console.log('Edit', row)
    },
    {
      id: 'delete',
      icon: 'delete',
      tooltip: 'Eliminar usuario',
      color: 'warn',
      action: (row) => this.onDeleteRow(row)
    }
  ];

  roleOptions = [
    { value: 'admin', label: 'Administrator', icon: 'admin_panel_settings' },
    { value: 'doctor', label: 'Doctor', icon: 'medical_services' },
    { value: 'nurse', label: 'Nurse', icon: 'local_hospital' },
    { value: 'patient', label: 'Patient', icon: 'person' },
  ];

  roleOptionsWithImages = [
    { value: 'admin', label: 'John Administrator', image: 'https://i.pravatar.cc/150?u=admin' },
    { value: 'doctor', label: 'Jane Medical', image: 'https://i.pravatar.cc/150?u=doctor' },
    { value: 'nurse', label: 'Alice Care', image: 'https://i.pravatar.cc/150?u=nurse' },
    { value: 'patient', label: 'Bob Patient', image: 'https://i.pravatar.cc/150?u=patient' },
    { value: 'nurse', label: 'Alice Care', image: 'https://i.pravatar.cc/150?u=nurse' },
    { value: 'patient', label: 'Bob Patient', image: 'https://i.pravatar.cc/150?u=patient' },
  ];


  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      notifications: [true],
      gender: ['other'],
      birthDate: [null],
      birthTime: ['12:00']
    });
  }

  ngOnInit() {
    // Register Widgets (In a real app, this happens in app.config or a startup service)
    this.registry.register('pilot-form-widget', PilotFormWidgetComponent);
  }

  onSelectionChange(selected: PilotUser[]) {
    console.log('Selected Rows:', selected);
  }

  onDeleteRow(row: PilotUser) {
    this.dialogService.confirm({
      title: 'Eliminar usuario',
      message: `¿Estás seguro de que deseas eliminar a ${row.name}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      confirmColor: 'danger',
      icon: 'person_remove'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.tableData = this.tableData.filter(u => u.id !== row.id);
        console.log('Single Deleted', row);
      }
    });
  }

  onBulkDelete(selected: PilotUser[]) {
    this.tableData = this.tableData.filter(u => !selected.includes(u));
    console.log('Bulk Deleted', selected);
  }

  toggleTheme() {
    this.uiConfig.toggleTheme();
  }

  toggleBrand() {
    this.uiConfig.toggleBrand();
  }

  toggleDensity() {
    const current = this.uiConfig.density();
    const next = current === 'default' ? 'compact' : current === 'compact' ? 'comfortable' : 'default';
    this.uiConfig.setDensity(next);
  }

  toggleInputAppearance() {
    this.uiConfig.inputAppearance.update(current => current === 'outline' ? 'filled' : 'outline');
  }

  openConfirmDialog() {
    this.dialogService.confirm({
      title: 'Confirmación',
      message: 'Este es un diálogo de confirmación estándar del sistema.',
      icon: 'help_outline',
      confirmText: 'Entendido'
    }).subscribe(res => console.log('Dialog result:', res));
  }

  submit() {
    if (this.form.valid) {
      this.isSaving = true;
      console.log('Form Value:', this.form.value);
      setTimeout(() => {
        this.isSaving = false;
        this.dialogService.alert({
          title: 'Login Exitoso',
          message: 'Bienvenido al sistema Vitalia.',
          icon: 'check_circle'
        });
      }, 1000);
    } else {
      this.form.markAllAsTouched();
      this.dialogService.confirm({
        title: 'Formulario Inválido',
        message: 'Por favor revisa los campos requeridos.',
        confirmColor: 'danger',
        icon: 'error_outline',
        cancelText: null // Alert mode
      });
    }
  }
}
