import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsService, LayoutMode, SidebarColor } from '../../core/services/settings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <!-- Floating Handle -->
    <button mat-fab color="primary" class="settings-handle" [class.handle-open]="isOpen()" (click)="toggle()">
      <mat-icon [class.spin]="isOpen()">settings</mat-icon>
    </button>

    <!-- Panel Content -->
    <div class="settings-panel" [class.open]="isOpen()" [class.dark-panel]="layoutMode() === 'dark'">
      <div class="settings-panel-header">
        <h3>Setting Panel</h3>
      </div>

      <div class="settings-content">
        <!-- Layout Section -->
        <div class="settings-section">
            <h3 class="section-title">Select Layout</h3>
            
            <div class="layout-toggles">
                <!-- Light Mode Card -->
                <div class="layout-card light-card" 
                     [class.selected]="layoutMode() === 'light'"
                     (click)="setLayout('light')">
                    <div class="image-preview">
                        <!-- Mockup of Light Layout -->
                        <div class="mock-header"></div>
                        <div class="mock-sidebar"></div>
                        <div class="mock-body">
                           <div class="mock-chart-row">
                             <div class="mock-chart"></div>
                             <div class="mock-chart"></div>
                             <div class="mock-chart"></div>
                           </div>
                        </div>
                    </div>
                    <span>Light</span>
                </div>

                <!-- Dark Mode Card -->
                <div class="layout-card dark-card" 
                     [class.selected]="layoutMode() === 'dark'"
                     (click)="setLayout('dark')">
                    <div class="image-preview">
                         <!-- Mockup of Dark Layout -->
                         <div class="mock-header"></div>
                         <div class="mock-sidebar"></div>
                         <div class="mock-body">
                           <div class="mock-chart-row">
                             <div class="mock-chart"></div>
                             <div class="mock-chart"></div>
                             <div class="mock-chart"></div>
                           </div>
                         </div>
                    </div>
                    <span>Dark</span>
                </div>
            </div>
        </div>

        <!-- Sidebar Section -->
        <div class="settings-section">
            <h3 class="section-title">Sidebar Menu Color</h3>
            
            <div class="sidebar-toggles">
                <button class="toggle-btn light-btn" 
                        [class.selected]="sidebarColor() === 'light'"
                        (click)="setSidebar('light')">
                    Light
                    <mat-icon *ngIf="sidebarColor() === 'light'" class="check-icon">check</mat-icon>
                </button>
                <button class="toggle-btn dark-btn" 
                        [class.selected]="sidebarColor() === 'dark'"
                        (click)="setSidebar('dark')">
                    Dark
                    <mat-icon *ngIf="sidebarColor() === 'dark'" class="check-icon">check</mat-icon>
                </button>
            </div>
        </div>

        <!-- Theme Section -->
        <div class="settings-section">
            <h3 class="section-title">Color Theme</h3>
            
            <div class="theme-grid">
                <button *ngFor="let theme of availableThemes" 
                        class="theme-circle" 
                        [class.active]="currentTheme === theme.className"
                        [matTooltip]="theme.displayName"
                        (click)="setTheme(theme.className)">
                  <span class="color-preview" [ngClass]="theme.className"></span>
                  <div class="active-overlay" *ngIf="currentTheme === theme.className">
                    <mat-icon>check</mat-icon>
                  </div>
                </button>
            </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div class="settings-backdrop" *ngIf="isOpen()" (click)="close()"></div>
  `,
  styles: `
    :host {
      position: fixed; top: 64px; right: 0; z-index: 1000; display: block; pointer-events: none;
    }
    :host > * { pointer-events: auto; }

    /* Handle */
    .settings-handle {
      position: fixed; top: 250px; right: 0; z-index: 1001;
      border-top-right-radius: 0; border-bottom-right-radius: 0;
      box-shadow: -2px 0 8px rgba(0,0,0,0.3);
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .settings-handle.handle-open { right: 280px; border-radius: 50%; border-top-right-radius: 0; border-bottom-right-radius: 0; }
    .settings-handle mat-icon { transition: transform 0.5s ease; }
    .settings-handle mat-icon.spin { transform: rotate(180deg); }

    /* Panel Container */
    .settings-panel {
      position: fixed; top: 64px; right: -280px; width: 280px; height: calc(100vh - 64px);
      background: #fff; /* Default Light Background */
      color: rgba(0,0,0,0.87);
      box-shadow: -5px 0 20px rgba(0,0,0,0.2);
      transition: right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      z-index: 999;
      display: flex; flex-direction: column;

      &.open { right: 0; }
      
      /* DARK MODE OVERRIDES */
      &.dark-panel {
          background: #1b1b28;
          color: #fff;
          box-shadow: -5px 0 20px rgba(0,0,0,0.5);

          .settings-panel-header {
              background: #000;
              border-bottom: 1px solid #111;
              h3 { color: #fff; }
          }
          
          .section-title { color: rgba(255,255,255,0.6); }
          .layout-card span { color: rgba(255,255,255,0.7); }
          
          .sidebar-toggles { 
              background: #111116; 
              border-color: #333; 
          }
          
          .toggle-btn {
              color: rgba(255,255,255,0.5);
              &.selected.dark-btn {
                  background: #000; color: #fff; border-color: #333;
              }
          }
      }
    }

    .settings-backdrop {
      position: fixed; top: 64px; left: 0; width: 100vw; height: calc(100vh - 64px);
      background: rgba(0,0,0,0.5); z-index: 998;
    }

    /* Header */
    .settings-panel-header {
      padding: 16px 20px;
      display: flex; justify-content: center; align-items: center;
      background: #f5f5f5; /* Light Header */
      color: rgba(0,0,0,0.87);
      border-bottom: 1px solid #e0e0e0;
      h3 { margin: 0; font-weight: 500; font-size: 16px; letter-spacing: 0.5px; }
      min-height: 56px;
    }

    .settings-content { padding: 20px; overflow-y: auto; flex: 1; }

    /* Titles */
    .section-title {
      padding: 0; margin: 0 0 12px 0;
      font-weight: 500; font-size: 13px;
      color: rgba(0,0,0,0.6); /* Light Mode Text */
      display: inline-block;
      position: relative;
    }
    .section-title::after {
      content: '';
      position: absolute;
      left: 0; bottom: -6px;
      width: 40px; height: 3px;
      background: #5c77ff;
      border-radius: 2px;
    }

    .settings-section {
      margin-bottom: 24px;
    }

    /* Layout Cards */
    .layout-toggles {
        display: flex; flex-direction: column; gap: 16px; margin-top: 12px;
    }

    .layout-card {
        cursor: pointer;
        padding: 0;
        text-align: center;
        transition: all 0.2s;
        background: transparent;

        &.selected .image-preview {
            border-color: #5c77ff; 
            box-shadow: 0 0 12px rgba(92, 119, 255, 0.4);
        }
        
        /* Text Label */
        span { display: block; margin-top: 8px; font-weight: 500; font-size: 13px; color: rgba(0,0,0,0.7); }
    }

    .image-preview {
        height: 90px;
        width: 160px;
        margin: 0 auto;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        display: flex; flex-direction: column;
        border: 2px solid transparent;
        transition: all 0.3s;
    }

    /* Fake UI Elements for high fidelity */
    .mock-header { height: 10px; width: 100%; position: relative; z-index: 2; }
    .mock-sidebar { height: 100%; width: 22%; position: absolute; top: 0; left: 0; z-index: 1; padding-top: 12px; }
    .mock-body { height: 100%; width: 78%; margin-left: 22%; padding: 6px; display: flex; align-items: center; justify-content: center; position: relative; top: 10px; height: calc(100% - 10px); box-sizing: border-box;}
    .mock-chart-row { display: flex; gap: 4px; width: 100%; justify-content: space-around; align-items: flex-end; height: 60%; }
    .mock-chart { width: 10px; background: currentColor; opacity: 0.5; border-radius: 2px; }
    .mock-chart:nth-child(1) { height: 40%; color: #4caf50; }
    .mock-chart:nth-child(2) { height: 70%; color: #ff9800; }
    .mock-chart:nth-child(3) { height: 50%; color: #f44336; }

    /* Light Mockup Styling */
    .light-card .image-preview {
         background: #f5f7fa;
         .mock-header { background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
         .mock-sidebar { background: #fff; border-right: 1px solid #eee; }
         .mock-body { background: #f5f7fa; }
    }

    /* Dark Mockup Styling */
    .dark-card .image-preview {
         background: #1e1e2d;
         border: 1px solid #333;
         .mock-header { background: #2b2b40; }
         .mock-sidebar { background: #2b2b40; }
         .mock-body { background: #1e1e2d; }
    }


    /* Sidebar Toggles (Pill) */
    .sidebar-toggles {
        display: flex;
        background: #f0f0f0; /* Light Mode Container */
        border-radius: 8px;
        padding: 4px;
        margin-top: 16px; 
        border: 1px solid #e0e0e0;
    }

    .toggle-btn {
        flex: 1;
        border: none;
        background: transparent;
        color: rgba(0,0,0,0.6);
        padding: 8px 16px; 
        cursor: pointer;
        font-weight: 500;
        border-radius: 6px;
        display: flex; justify-content: center; align-items: center; gap: 8px;
        transition: all 0.2s;
        font-size: 13px;

        &.selected {
            &.light-btn { 
                background: #fff; 
                color: #000 !important; /* Force black text on white background */
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
            }
            &.dark-btn {
                background: #333; 
                color: #fff !important; /* Force white text on dark background */
                border: 1px solid #333;
            }
        }
        
        // Ensure unselected buttons are visible in dark panel
        &:not(.selected) {
            color: inherit; /* Inherit from parent for visibility */
        }
        
        .check-icon { font-size: 16px; width: 16px; height: 16px; font-weight: bold; }
    }

    /* Theme Grid */
    .theme-grid {
      display: flex;
      gap: 12px;
      margin-top: 16px; 
    }

    .theme-circle {
      width: 32px; height: 32px; 
      border-radius: 50%; border: none; padding: 0;
      background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center;
      position: relative;
      transition: all 0.2s;
    }

    .color-preview {
      width: 100%; height: 100%; border-radius: 50%; display: block;
    }

    .active-overlay {
        position: absolute; top: -3px; left: -3px; right: -3px; bottom: -3px;
        border-radius: 50%;
        border: 2px solid #5c77ff;
        display: flex; align-items: center; justify-content: center;
        
        mat-icon { 
            font-size: 12px; width: 12px; height: 12px; 
            color: #000; 
            background: #fff; 
            border-radius: 50%; 
            padding: 2px; 
            position: absolute; 
            bottom: 0; right: 0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
    }

    /* Corrected Colors (Split/Gradient) */
    .color-preview.light-theme { background: #ffffff; border: 2px solid #e0e0e0; }
    .color-preview.dark-theme { background: #111116; }
    .color-preview.indigo-pink { background: linear-gradient(135deg, #3f51b5 50%, #ff4081 50%); }
    .color-preview.deeppurple-amber { background: linear-gradient(135deg, #673ab7 50%, #ffc107 50%); }
    .color-preview.pink-bluegrey { background: linear-gradient(135deg, #e91e63 50%, #607d8b 50%); }
    .color-preview.purple-green { background: linear-gradient(135deg, #9c27b0 50%, #4caf50 50%); }
 

  `,
})
export class SettingsPanel {
  private settingsService = inject(SettingsService);

  isOpen = signal(false);
  layoutMode = this.settingsService.layoutMode;
  sidebarColor = this.settingsService.sidebarColor;
  availableThemes = this.settingsService.availableThemes;

  get currentTheme() {
    return this.settingsService.getCurrentTheme();
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }

  setLayout(mode: string) {
    this.settingsService.setLayoutMode(mode as LayoutMode);
  }

  setSidebar(color: string) {
    this.settingsService.setSidebarColor(color as SidebarColor);
  }

  setTheme(themeName: string) {
    this.settingsService.setTheme(themeName);
  }
}
