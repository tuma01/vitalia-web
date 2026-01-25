import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    Input,
    OnDestroy,
    QueryList
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiExpansionPanelComponent } from './ui-expansion-panel.component';
import { Subject, takeUntil, startWith } from 'rxjs';

@Component({
    selector: 'ui-accordion',
    standalone: true,
    imports: [CommonModule],
    template: `<ng-content></ng-content>`,
    styles: [`
    :host { display: block; width: 100%; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiAccordionComponent implements AfterContentInit, OnDestroy {
    @ContentChildren(UiExpansionPanelComponent) panels!: QueryList<UiExpansionPanelComponent>;

    @Input() multi = false; // If true, multiple panels can be open

    private destroy$ = new Subject<void>();

    ngAfterContentInit(): void {
        // Watch for new panels or expansion changes
        this.panels.changes.pipe(
            startWith(this.panels),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.panels.forEach(panel => {
                panel.expandedChange.pipe(takeUntil(this.destroy$)).subscribe(expanded => {
                    if (expanded && !this.multi) {
                        this.closeOthers(panel);
                    }
                });
            });
        });
    }

    private closeOthers(activePanel: UiExpansionPanelComponent): void {
        this.panels.forEach(panel => {
            if (panel !== activePanel) {
                panel.collapse();
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
