import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UiProgressBarComponent } from '../progress-bar/ui-progress-bar.component';
import { UiFileUploaderI18n, DEFAULT_PAL_I18N } from '../../config/ui-i18n.types';

/**
 * UiFileUploaderComponent
 * Molecular component for professional file uploading.
 * Supports drag & drop, progress status, and automated validation.
 */
@Component({
  selector: 'ui-file-uploader',
  standalone: true,
  imports: [CommonModule, MatIconModule, UiProgressBarComponent],
  template: `
    <div 
      class="ui-file-uploader"
      [class.ui-file-uploader--dragging]="isDragging()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave()"
      (drop)="onDrop($event)">
      
      <div class="ui-file-uploader__zone" *ngIf="!file()">
        <mat-icon class="ui-file-uploader__icon">cloud_upload</mat-icon>
        <p class="ui-file-uploader__text">
          <strong>{{ i18n.dragDropLabel }}</strong> 
          <span class="ui-file-uploader__browse" (click)="fileInput.click()">{{ i18n.browseLabel }}</span>
        </p>
        <p class="ui-file-uploader__hint">{{ getMaxSizeHint() }}</p>
        <input 
          #fileInput 
          type="file" 
          [accept]="accept" 
          style="display: none" 
          (change)="onFileSelected($event)">
      </div>

      <div class="ui-file-uploader__preview" *ngIf="file()">
        <mat-icon class="ui-file-uploader__preview-icon">description</mat-icon>
        <div class="ui-file-uploader__info">
          <span class="ui-file-uploader__filename">{{ file()?.name }}</span>
          <span class="ui-file-uploader__filesize">{{ (file()?.size || 0) / 1024 | number:'1.0-2' }} KB</span>
        </div>
        <button class="ui-file-uploader__remove" [attr.aria-label]="i18n.removeLabel" (click)="removeFile()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="ui-file-uploader__progress" *ngIf="isUploading()">
        <ui-progress-bar [value]="progress()" mode="determinate"></ui-progress-bar>
        <span class="ui-file-uploader__percentage">{{ progress() }}% {{ i18n.uploadingLabel }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .ui-file-uploader {
      width: 100%;
      border: 2px dashed var(--ui-color-border, #e5e7eb);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--ui-color-surface, #fff);
      position: relative;
      overflow: hidden;
    }

    .ui-file-uploader--dragging {
      border-color: var(--ui-color-primary, #0055A4);
      background: var(--ui-color-primary-transparent, rgba(0, 85, 164, 0.05));
      transform: scale(1.01);
    }

    .ui-file-uploader__icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--ui-color-primary, #0055A4);
      margin-bottom: 1rem;
    }

    .ui-file-uploader__text {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: var(--ui-color-text-primary, #111827);
    }

    .ui-file-uploader__browse {
      color: var(--ui-color-primary, #0055A4);
      font-weight: 600;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }

    .ui-file-uploader__hint {
      font-size: 0.875rem;
      color: var(--ui-color-text-secondary, #4b5563);
    }

    .ui-file-uploader__preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      padding: 1rem;
      background: var(--ui-background-variant, #f3f4f6);
      border-radius: 8px;
    }

    .ui-file-uploader__preview-icon {
      color: var(--ui-color-primary, #0055A4);
    }

    .ui-file-uploader__info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .ui-file-uploader__filename {
      font-weight: 500;
      color: var(--ui-color-text-primary, #111827);
    }

    .ui-file-uploader__filesize {
      font-size: 0.75rem;
      color: var(--ui-color-text-secondary, #4b5563);
    }

    .ui-file-uploader__remove {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--ui-color-danger, #ef4444);
      border-radius: 50%;
      transition: background 0.2s;
      &:hover {
        background: rgba(239, 68, 68, 0.1);
      }
    }

    .ui-file-uploader__progress {
      margin-top: 1rem;
      text-align: right;
    }

    .ui-file-uploader__percentage {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ui-color-primary, #0055A4);
    }

    :host-context(.theme-dark) .ui-file-uploader {
      background: var(--ui-background-surface, #1f2937);
      border-color: var(--ui-color-border, #374151);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiFileUploaderComponent {
  @Input() accept = '*';
  @Input() maxSize = 10; // MB
  @Input() i18n: UiFileUploaderI18n = DEFAULT_PAL_I18N.fileUploader;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileRemoved = new EventEmitter<void>();

  isDragging = signal(false);
  file = signal<File | null>(null);
  isUploading = signal(false);
  progress = signal(0);

  getMaxSizeHint(): string {
    return (this.i18n.maxSizeHint || '')
      .replace('%d', this.maxSize.toString())
      .replace('%s', this.accept);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files?.length) {
      this.handleFile(event.target.files[0]);
    }
  }

  private handleFile(file: File) {
    if (file.size > this.maxSize * 1024 * 1024) {
      const errorMsg = (this.i18n.errorMaxSize || '').replace('%d', this.maxSize.toString());
      alert(errorMsg);
      return;
    }
    this.file.set(file);
    this.fileSelected.emit(file);

    // Simulate upload
    this.simulateUpload();
  }

  removeFile() {
    this.file.set(null);
    this.isUploading.set(false);
    this.progress.set(0);
    this.fileRemoved.emit();
  }

  private simulateUpload() {
    this.isUploading.set(true);
    this.progress.set(0);

    const interval = setInterval(() => {
      if (this.progress() >= 100) {
        clearInterval(interval);
        this.isUploading.set(false);
      } else {
        this.progress.update(p => p + 10);
      }
    }, 200);
  }
}
