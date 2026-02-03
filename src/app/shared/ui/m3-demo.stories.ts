import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

const meta: Meta = {
    title: 'Forms/Material M3 Demo',
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
            ],
        }),
    ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => {
        const form: FormGroup = new FormGroup({
            name: new FormControl(''),
            email: new FormControl(''),
        });

        return {
            template: `
        <form [formGroup]="form" style="width: 400px; display: flex; flex-direction: column; gap: 16px; margin: 40px auto;">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput placeholder="Enter your name" formControlName="name">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput placeholder="Enter your email" formControlName="email">
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">Submit</button>
        </form>
      `,
            props: { form },
        };
    },
};
