import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaItem } from '../core/models';

/** Photo + GIF gallery fed by the Google Drive folder of a trip. */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="items.length" class="gallery">
      <div class="thumbs">
        <button *ngFor="let m of items" (click)="active.set(m)"
                [class.selected]="active() === m" [attr.aria-label]="'Show ' + m.name">
          <img [src]="m.thumb" [alt]="m.name" loading="lazy">
          <span class="gif-tag" *ngIf="m.isGif">GIF</span>
        </button>
      </div>
      <figure *ngIf="active() as a">
        <img [src]="a.url" [alt]="a.name">
      </figure>
    </div>
    <p *ngIf="!items.length" class="muted empty">
      Photos coming soon — link a Google Drive folder to this trip to show its gallery.
    </p>
  `,
  styles: [`
    .gallery { display: grid; grid-template-columns: 110px 1fr; gap: 14px; }
    @media (max-width: 620px) { .gallery { grid-template-columns: 1fr; } }
    .thumbs { display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; }
    @media (max-width: 620px) { .thumbs { flex-direction: row; overflow-x: auto; max-height: none; } }
    .thumbs button { position: relative; border: 2px solid transparent; border-radius: 10px;
      padding: 0; cursor: pointer; background: none; flex-shrink: 0; }
    .thumbs button.selected { border-color: var(--pine); }
    .thumbs img { width: 100px; height: 70px; object-fit: cover; border-radius: 8px; }
    .gif-tag { position: absolute; bottom: 6px; right: 6px; background: var(--marigold);
      color: var(--ink); font-size: 0.6rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; }
    figure { margin: 0; }
    figure img { width: 100%; max-height: 420px; object-fit: cover; border-radius: var(--radius); }
    .empty { padding: 24px; border: 1.5px dashed var(--line); border-radius: var(--radius); }
  `]
})
export class GalleryComponent {
  active = signal<MediaItem | null>(null);
  private _items: MediaItem[] = [];

  @Input() set items(v: MediaItem[]) {
    this._items = v || [];
    this.active.set(this._items[0] ?? null);
  }
  get items(): MediaItem[] { return this._items; }
}
