import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { UiButtonComponent } from '../primitives/button/ui-button.component';
import { UiInputComponent } from '../primitives/input/ui-input.component';
import { UiFormFieldComponent } from '../components/form-field/ui-form-field.component';
import { UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardTitleDirective } from '../components/card/ui-card.component';
import { ThemeService } from '../../../core/services/theme.service';

const meta: Meta = {
  title: 'Visual Regression/Critical Patterns/Product Showcase',
  tags: ['critical'],
  decorators: [
    applicationConfig({
      providers: [ThemeService]
    })
  ]
};

export default meta;
type Story = StoryObj;

export const LoginForm: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [UiButtonComponent, UiInputComponent, UiFormFieldComponent, UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardTitleDirective],
    },
    template: `
      <div style="background: var(--ui-background-variant); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;">
        <ui-card style="width: 100%; max-width: 400px;">
          <ui-card-header>
            <h2 uiCardTitle style="text-align: center;">Vitalia Platform</h2>
            <p style="text-align: center; color: var(--ui-color-text-secondary); font-size: 14px;">Enterprise SaaS Authentication</p>
          </ui-card-header>
          <ui-card-content>
            <form (submit)="$event.preventDefault()" style="display: flex; flex-direction: column; gap: 20px;">
              <ui-form-field label="Username / Email" required>
                <ui-input placeholder="admin@vitalia.com"></ui-input>
              </ui-form-field>
              
              <ui-form-field label="Password" required>
                <ui-input type="password" value="********"></ui-input>
              </ui-form-field>

              <div style="display: flex; justify-content: flex-end;">
                <a href="#" style="color: var(--ui-color-text-link); font-size: 12px; text-decoration: none;" (click)="$event.preventDefault()">Forgot password?</a>
              </div>

              <ui-button variant="primary" style="width: 100%;">Sign In</ui-button>
              
              <div style="text-align: center; margin-top: 12px;">
                <p style="color: var(--ui-color-text-disabled); font-size: 12px;">Access restricted to authorized medical personnel.</p>
              </div>
            </form>
          </ui-card-content>
        </ui-card>
      </div>
    `,
  }),
};

export const MedicalFormSection: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [UiButtonComponent, UiInputComponent, UiFormFieldComponent, UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardTitleDirective],
    },
    template: `
      <div style="padding: 32px; background: var(--ui-background-default); min-height: 100vh; font-family: var(--ui-typography-font-family-base);">
        <h2 style="color: var(--ui-color-text-primary); margin-bottom: 24px;">Patient Clinical Record</h2>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px;">
          <ui-form-field label="Full Name">
            <ui-input value="John Doe"></ui-input>
          </ui-form-field>

          <ui-form-field label="ID / Document" hint="Search by official ID">
            <ui-input value="PA-12938-B"></ui-input>
          </ui-form-field>

          <ui-form-field label="Blood Type" [disabled]="true">
            <ui-input value="O+" [disabled]="true"></ui-input>
          </ui-form-field>

          <ui-form-field label="Allergies" error="High Severity: Penicillin">
            <ui-input value="Penicillin, Peanuts"></ui-input>
          </ui-form-field>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px;">
          <ui-button variant="outline">Cancel</ui-button>
          <ui-button variant="primary">Update Record</ui-button>
        </div>
      </div>
    `,
  }),
};

/** Matrix Snapshots (Baseline x Mode) */
export const LoginVitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...LoginForm };
export const LoginVitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...LoginForm };
export const LoginSchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...LoginForm };
export const LoginSchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...LoginForm };

export const MedicalVitaliaLight = { parameters: { globals: { baseline: 'vitalia-light' } }, ...MedicalFormSection };
export const MedicalVitaliaDark = { parameters: { globals: { baseline: 'vitalia-dark' } }, ...MedicalFormSection };
export const MedicalSchoolLight = { parameters: { globals: { baseline: 'school-light' } }, ...MedicalFormSection };
export const MedicalSchoolDark = { parameters: { globals: { baseline: 'school-dark' } }, ...MedicalFormSection };
