import { Component, OnInit, inject, Output, EventEmitter, input, ViewEncapsulation, computed, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { SessionService } from '../../../core/services/session.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SidemenuComponent } from '../sidemenu/sidemenu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatIconModule,
    SidemenuComponent
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  encapsulation: ViewEncapsulation.None
})
export class Sidebar implements OnInit {
  private sessionService = inject(SessionService);
  private breakpointObserver = inject(BreakpointObserver);

  isCollapsed = input(false);
  isMobile = false;

  userName = computed(() => {
    const user = this.sessionService.user();
    return user?.personName || user?.email || 'Usuario';
  });

  userRole = computed(() => {
    return this.sessionService.user()?.roles?.[0] || 'Rol';
  });

  @Output() hoverChange = new EventEmitter<boolean>();
  @Output() menuItemClick = new EventEmitter<void>();

  @HostListener('mouseenter')
  onMouseEnter() {
    this.hoverChange.emit(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hoverChange.emit(false);
  }

  constructor() { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  onMenuItemClick(): void {
    if (this.isMobile) {
      this.menuItemClick.emit();
    }
  }
}
