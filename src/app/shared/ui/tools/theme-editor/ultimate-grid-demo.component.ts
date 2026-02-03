import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoFormExtendedComponent } from '../../examples/demo-form-extended/demo-form-extended.component';
import { BRAND_PRESETS } from '../../../../core/services/ui-brand-presets';

@Component({
    selector: 'app-ultimate-grid-demo',
    standalone: true,
    imports: [CommonModule, DemoFormExtendedComponent],
    template: `
    <div style="padding: 3rem; background: #0f172a; color: white; font-family: 'Inter', sans-serif;">
      <header style="margin-bottom: 4rem; border-bottom: 2px solid #38bdf8; padding-bottom: 1rem;">
        <h1 style="color: #f8fafc; font-size: 2rem; margin: 0;">PAL Ultra-Industrial Grid</h1>
        <p style="color: #94a3b8; margin-top: 0.5rem;">
          Automated Coverage: {{ brands.length * modes.length * densities.length * states.length }} permutations
        </p>
      </header>
      
      <div *ngFor="let brand of brands" style="margin-bottom: 6rem;">
        <h2 style="color: #38bdf8; text-transform: uppercase; font-size: 2rem; margin-bottom: 3rem;">{{ brand }}</h2>
        
        <div *ngFor="let mode of modes" style="margin-bottom: 4rem; background: rgba(255,255,255,0.03); padding: 2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span [style.background]="mode === 'light' ? '#fff' : '#0ea5e9'" style="width: 14px; height: 14px; border-radius: 50%;"></span>
            <h3 style="text-transform: capitalize; color: #e2e8f0; margin: 0; font-size: 1.5rem;">{{ mode }} Mode</h3>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem;">
            <div *ngFor="let density of densities">
              <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; color: #94a3b8; margin-bottom: 1.5rem; font-weight: bold;">
                {{ density }}
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                <app-demo-form-extended 
                  *ngFor="let state of states"
                  [brand]="brand" 
                  [mode]="mode" 
                  [density]="density"
                  [state]="state">
                </app-demo-form-extended>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer style="margin-top: 6rem; text-align: center; color: #64748b; font-size: 0.8rem; opacity: 0.7;">
        Vitalia PAL Ultimate Grid • Critical Tag Enabled • Zero-Trust Visual CI/CD
      </footer>
    </div>
  `,
})
export class UltimateGridDemoComponent {
    brands = Object.keys(BRAND_PRESETS);
    modes: ('light' | 'dark')[] = ['light', 'dark'];
    densities: ('default' | 'comfortable' | 'compact')[] = ['default', 'comfortable', 'compact'];
    states: ('default' | 'focused' | 'error' | 'disabled' | 'required' | 'filled')[] = [
        'default', 'focused', 'error', 'disabled', 'required', 'filled'
    ];
}
