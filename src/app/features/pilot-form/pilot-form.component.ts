import { Component, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UiConfigService } from '../../core/services/ui-config.service';
import { UiButtonComponent } from '../../shared/ui/button/ui-button.component';
import { UiInputComponent } from '../../shared/ui/input/ui-input.component';
import { UiFormFieldComponent } from '../../shared/ui/form-field/ui-form-field.component';
import { UiErrorDirective, UiPrefixDirective, UiSuffixDirective } from '../../shared/ui/form-field/ui-form-field.directives';
import { UiSelectComponent } from '../../shared/ui/select/ui-select.component';
import { UiDataTableComponent } from '../../shared/ui/data-table/ui-data-table.component';
import { UiProgressSpinnerComponent } from '../../shared/ui/progress-spinner/ui-progress-spinner.component';
import { UiProgressBarComponent } from '../../shared/ui/progress-bar/ui-progress-bar.component';
import { UiTabGroupComponent, UiTabComponent } from '../../shared/ui/tabs';
import { UiAccordionComponent, UiExpansionPanelComponent } from '../../shared/ui/expansion';
import { UiTableColumn, UiTableAction } from '../../shared/ui/data-table/ui-data-table.types';
import { UiTagComponent } from '../../shared/ui/tag/ui-tag.component';
import { VitaliaBadgeComponent } from '../../shared/ui/badge/vitalia-badge.component';
import { UiDatepickerComponent } from '../../shared/ui/datepicker/ui-datepicker.component';
import { UiTimepickerComponent } from '../../shared/ui/datepicker/ui-timepicker.component';
import { UiToolbarComponent } from '../../shared/ui/toolbar/ui-toolbar.component';
import { UiIconButtonComponent } from '../../shared/ui/button/ui-icon-button.component';
import { ZoneRendererComponent } from '../../layout/zones/zone-renderer.component';
import { WidgetRegistryService } from '../../core/services/widget-registry.service';
import { PilotFormWidgetComponent } from '../../widgets/pilot-form-widget/pilot-form-widget.component';
import { UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardFooterComponent, UiCardTitleDirective, UiCardSubtitleDirective } from '../../shared/ui/card/ui-card.component';
import { UiCheckboxComponent } from '../../shared/ui/checkbox/ui-checkbox.component';
import { UiRadioGroupComponent } from '../../shared/ui/radio/ui-radio-group.component';
import { UiRadioButtonComponent } from '../../shared/ui/radio/ui-radio.component';
import { UiToggleComponent } from '../../shared/ui/toggle/ui-toggle.component';
import { UiDialogService } from '../../shared/ui/dialog/ui-dialog.service';

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
    ReactiveFormsModule,
    TitleCasePipe,
    UiButtonComponent,
    UiInputComponent,
    UiFormFieldComponent,
    UiPrefixDirective, UiSuffixDirective,
    UiSelectComponent,
    UiProgressSpinnerComponent,
    UiProgressBarComponent,
    UiTabGroupComponent,
    UiTabComponent,
    UiAccordionComponent,
    UiExpansionPanelComponent,
    UiDataTableComponent,
    ZoneRendererComponent,
    UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardFooterComponent, UiCardTitleDirective, UiCardSubtitleDirective,
    UiCheckboxComponent,
    UiRadioGroupComponent, UiRadioButtonComponent,
    MatIconModule,
    UiToggleComponent,
    UiTagComponent,
    VitaliaBadgeComponent,
    UiDatepickerComponent,
    UiTimepickerComponent,
    UiToolbarComponent,
    UiIconButtonComponent
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
  isSaving = false;

  registry = inject(WidgetRegistryService);

  // Widget Configuration for Zone Renderer
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
    { id: 1, name: 'John Doe', email: 'john@vitalia.com', role: 'Admin', status: 'Active', salary: 45000, avatar: 'https://i.pravatar.cc/150?u=1', platform: 'Windows', platformIcon: 'desktop_windows' },
    { id: 2, name: 'Jane Smith', email: 'jane@school.com', role: 'Doctor', status: 'Active', salary: 75000, avatar: 'https://i.pravatar.cc/150?u=2', platform: 'MacOS', platformIcon: 'desktop_mac' },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', role: 'Patient', status: 'Inactive', salary: 0, avatar: 'https://i.pravatar.cc/150?u=3', platform: 'Linux', platformIcon: 'computer' },
    { id: 4, name: 'Alice Williams', email: 'alice@vitalia.com', role: 'Nurse', status: 'Active', salary: 38000, avatar: 'https://i.pravatar.cc/150?u=4', platform: 'iOS', platformIcon: 'phone_iphone' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@vitalia.com', role: 'Employee', status: 'Active', salary: 32000, avatar: 'https://i.pravatar.cc/150?u=5', platform: 'Android', platformIcon: 'phone_android' },
    { id: 6, name: 'David Wilson', email: 'david@vitalia.com', role: 'Patient', status: 'Active', salary: 0, avatar: 'https://i.pravatar.cc/150?u=6', platform: 'Web', platformIcon: 'public' },
    { id: 7, name: 'Emma Davis', email: 'emma@vitalia.com', role: 'Doctor', status: 'Inactive', salary: 72000, avatar: 'https://i.pravatar.cc/150?u=7', platform: 'Windows', platformIcon: 'desktop_windows' },
    { id: 8, name: 'Frank Miller', email: 'frank@vitalia.com', role: 'Admin', status: 'Active', salary: 50000, avatar: 'https://i.pravatar.cc/150?u=8', platform: 'MacOS', platformIcon: 'desktop_mac' },
    { id: 9, name: 'Grace Taylor', email: 'grace@vitalia.com', role: 'Nurse', status: 'Active', salary: 41000, avatar: 'https://i.pravatar.cc/150?u=9', platform: 'iOS', platformIcon: 'phone_iphone' },
    { id: 10, name: 'Henry Moore', email: 'henry@vitalia.com', role: 'Employee', status: 'Inactive', salary: 28000, avatar: 'https://i.pravatar.cc/150?u=10', platform: 'Android', platformIcon: 'phone_android' },
  ];

  tableColumns: UiTableColumn<any>[] = [
    { key: 'name', header: 'User', type: 'avatar', imageProperty: 'avatar', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'platform', header: 'Platform', type: 'icon', iconProperty: 'platformIcon' },
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
  ];

  constructor(
    private fb: FormBuilder,
    public uiConfig: UiConfigService,
    private dialogService: UiDialogService
  ) {
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
