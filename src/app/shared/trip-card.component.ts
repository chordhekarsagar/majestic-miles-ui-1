import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../core/models';
import { environment } from '../../environments/environment';

/**
 * Boarding-pass style trip card: photo on top, details in the middle,
 * and a perforated "stub" holding price + CTA.
 */
@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="card trip-card">
      <a [routerLink]="['/tours', trip.slug]" class="photo">
        <img [src]="cover" [alt]="trip.title" loading="lazy">
        <span class="badge gold" *ngIf="trip.is_featured">Featured</span>
      </a>
      <div class="body">
        <div class="meta">
          <span class="badge">{{ trip.duration_label || trip.duration_days + ' Days' }}</span>
          <span class="badge">{{ trip.difficulty }}</span>
        </div>
        <h3><a [routerLink]="['/tours', trip.slug]">{{ trip.title }}</a></h3>
        <p class="muted location" *ngIf="trip.location">📍 {{ trip.location }}</p>
      </div>
      <div class="stub">
        <div>
          <span class="from muted">From</span>
          <strong>₹{{ trip.price | number:'1.0-0' }}</strong>
        </div>
        <a [routerLink]="['/tours', trip.slug]" class="btn btn-accent">View trip</a>
      </div>
    </article>
  `,
  styles: [`
    .trip-card { display: flex; flex-direction: column; height: 100%;
      transition: transform 0.18s, box-shadow 0.18s; }
    .trip-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
    .photo { position: relative; aspect-ratio: 16/10; overflow: hidden; background: var(--line); }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .photo .badge { position: absolute; top: 12px; left: 12px; }
    .body { padding: 18px 18px 8px; flex: 1; }
    .meta { display: flex; gap: 8px; margin-bottom: 10px; }
    h3 { margin-bottom: 4px; }
    h3 a { color: var(--ink); }
    .location { font-size: 0.85rem; margin: 0; }
    .stub { display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; border-top: 2px dashed var(--line); }
    .from { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .stub strong { font-family: var(--display); font-size: 1.25rem; }
  `]
})
export class TripCardComponent {
  @Input({ required: true }) trip!: Trip;

  get cover(): string {
    if (this.trip.cover_image?.startsWith('http')) return this.trip.cover_image;
    if (this.trip.cover_image) return `${environment.apiUrl}/image/${this.trip.cover_image}`;
    // Placeholder gradient rendered as inline SVG when no photo is set yet
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%232f6b4f"/><stop offset="1" stop-color="%231c2321"/></linearGradient></defs><rect width="800" height="500" fill="url(%23g)"/><text x="50%" y="52%" fill="white" font-family="sans-serif" font-size="30" text-anchor="middle" opacity="0.85">${this.trip.title}</text></svg>`
    );
  }
}
