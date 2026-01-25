import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { Component, Input, importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiDialogService } from './ui-dialog.service';
import { UiButtonComponent } from '../../primitives/button/ui-button.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ui-dialog-demo',
    standalone: true,
    imports: [CommonModule, UiButtonComponent],
    template: `
    <div style="display: flex; gap: 16px;">
      <ui-button (click)="openConfirm()">Open Confirm</ui-button>
      <ui-button variant="danger" (click)="openDelete()">Open Delete</ui-button>
      <ui-button variant="secondary" (click)="openAlert()">Open Alert</ui-button>
    </div>
    <div *ngIf="lastResult !== undefined" style="margin-top: 16px;">
      Last Result: <strong>{{ lastResult }}</strong>
    </div>
  `
})
class UiDialogDemoComponent {
    lastResult?: boolean;

    constructor(private dialogService: UiDialogService) { }

    openConfirm() {
        this.dialogService.confirm({
            title: 'Confirm Action',
            message: 'Are you sure you want to proceed with this action?',
            icon: 'help_outline'
        }).subscribe(res => this.lastResult = res);
    }

    openDelete() {
        this.dialogService.confirm({
            title: 'Delete Item',
            message: 'This action cannot be undone. Are you sure?',
            confirmText: 'Delete',
            confirmColor: 'danger',
            icon: 'warning'
        }).subscribe(res => this.lastResult = res);
    }

    openAlert() {
        this.dialogService.alert({
            title: 'Success',
            message: 'The operation completed successfully.',
            icon: 'check_circle'
        }).subscribe(res => this.lastResult = res);
    }
}

const meta: Meta<UiDialogDemoComponent> = {
    title: 'Shared/UI/Dialog',
    component: UiDialogDemoComponent,
    tags: ['autodocs'],
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(MatDialogModule, BrowserAnimationsModule),
                UiDialogService
            ]
        })
    ]
};

export default meta;
type Story = StoryObj<UiDialogDemoComponent>;

export const Default: Story = {};
