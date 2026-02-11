import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingsService, LayoutMode, SidenavColor, Density } from '../../../core/services/settings.service';
import { ThemeService } from '../../../core/theme/theme.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatRippleModule,
  ],
  templateUrl: './settings-panel.html',
  styleUrl: './settings-panel.scss'
})
export class SettingsPanel {
  private settingsService = inject(SettingsService);
  private themeService = inject(ThemeService);

  @Input() isOpen = false;

  layoutMode = this.settingsService.layoutMode;
  sidenavColor = this.settingsService.sidenavColor;
  density = this.settingsService.density;

  themeColors = [
    { name: 'Default', hex: '#ffffff' }, // ✅ Add white/default option
    { name: 'Indigo', hex: '#5d78ff' },
    { name: 'Steel', hex: '#4682B4' },
    { name: 'Green', hex: '#4caf50' },
    { name: 'Orange', hex: '#ff9800' },
    { name: 'Cyan', hex: '#00bcd4' },
    { name: 'Purple', hex: '#7c4dff' },
    { name: 'Steel', hex: '#607d8b' },
    { name: 'Dark', hex: '#111421' }
  ];

  get currentPrimaryColor(): string {
    return this.settingsService.headerColor();
  }

  // Determinar el color real de la marca (Indigo si el header es blanco)
  get currentBrandColor(): string {
    const color = this.currentPrimaryColor;
    return (color.toLowerCase() === '#ffffff') ? '#3f51b5' : color;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  setLayout(mode: LayoutMode) {
    this.settingsService.setLayoutMode(mode);
  }

  setSidenavColor(color: SidenavColor) {
    this.settingsService.setSidenavColor(color);
  }

  setDensity(density: Density) {
    this.settingsService.setDensity(density);
  }

  setThemeColor(hex: string) {
    this.settingsService.setHeaderColor(hex);
  }

  resetDefaults() {
    this.setLayout('light');
    this.setSidenavColor('light');
    this.setDensity('default');
    this.settingsService.setHeaderColor('#ffffff'); // Reset to default white
  }
}
