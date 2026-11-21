import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Collection, Trip } from '../../core/models';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="section container wrap">
      <a routerLink="/admin" class="crumb">← Dashboard</a>
      <p class="eyebrow">Admin</p>
      <h1>{{ id ? 'Edit trip' : 'New trip' }}</h1>

      <form class="card pad" (ngSubmit)="save()">
        <div class="grid grid-2">
          <div>
            <label for="title">Title</label>
            <input id="title" name="title" [(ngModel)]="model.title" required>
          </div>
          <div>
            <label for="slug">Slug (URL)</label>
            <input id="slug" name="slug" [(ngModel)]="model.slug" placeholder="e.g. gokarna-backpacking" required>
          </div>
        </div>

        <label for="coll">Collection</label>
        <select id="coll" name="coll" [(ngModel)]="model.collection_id">
          <option [ngValue]="null">— None —</option>
          <option *ngFor="let c of collections()" [ngValue]="c.id">{{ c.name }}</option>
        </select>

        <label for="summary">Summary (card text)</label>
        <input id="summary" name="summary" [(ngModel)]="model.summary">

        <label for="desc">Description</label>
        <textarea id="desc" name="desc" rows="4" [(ngModel)]="model.description"></textarea>

        <div class="grid grid-2">
          <div><label for="price">Price (₹)</label>
            <input id="price" name="price" type="number" [(ngModel)]="model.price" required></div>
          <div><label for="days">Duration (days)</label>
            <input id="days" name="days" type="number" [(ngModel)]="model.duration_days" required></div>
          <div><label for="dlabel">Duration label</label>
            <input id="dlabel" name="dlabel" [(ngModel)]="model.duration_label" placeholder="2 Nights 3 Days"></div>
          <div><label for="diff">Difficulty</label>
            <select id="diff" name="diff" [(ngModel)]="model.difficulty">
              <option>Easy</option><option>Moderate</option><option>Challenging</option>
            </select></div>
        </div>

        <label for="loc">Location</label>
        <input id="loc" name="loc" [(ngModel)]="model.location">

        <label for="drive">Google Drive folder ID (photos & GIFs)</label>
        <input id="drive" name="drive" [(ngModel)]="model.drive_folder_id"
               placeholder="the long id from drive.google.com/drive/folders/<ID>">

        <label for="cover">Cover image (Drive file ID or full URL)</label>
        <input id="cover" name="cover" [(ngModel)]="model.cover_image">

        <label for="dates">Upcoming dates (comma-separated, YYYY-MM-DD)</label>
        <input id="dates" name="dates" [(ngModel)]="datesText" placeholder="2026-08-01, 2026-08-15">

        <label for="inc">Inclusions (comma-separated)</label>
        <input id="inc" name="inc" [(ngModel)]="inclusionsText">

        <label class="check">
          <input type="checkbox" name="featured" [(ngModel)]="model.is_featured"> Featured on home page
        </label>

        <div class="actions">
          <button class="btn btn-primary" [disabled]="busy()">
            {{ busy() ? 'Saving…' : (id ? 'Save changes' : 'Create trip') }}
          </button>
          <a routerLink="/admin" class="btn btn-ghost">Cancel</a>
        </div>
        <p class="err" *ngIf="error()">{{ error() }}</p>
      </form>
    </section>
  `,
  styles: [`
    .wrap { max-width: 820px; }
    .crumb { display: inline-block; margin-bottom: 12px; font-weight: 500; }
    .pad { padding: 28px; margin-top: 12px; }
    .check { display: flex; align-items: center; gap: 10px; font-weight: 500; margin: 8px 0 20px; }
    .check input { width: auto; margin: 0; }
    .actions { display: flex; gap: 12px; }
    .err { color: #b3372f; font-size: 0.88rem; margin-top: 12px; }
  `]
})
export class TripFormComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = null;
  collections = signal<Collection[]>([]);
  busy = signal(false); error = signal('');

  model: Partial<Trip> = {
    title: '', slug: '', collection_id: undefined, summary: '', description: '',
    price: 0, duration_days: 1, duration_label: '', difficulty: 'Easy',
    location: '', drive_folder_id: '', cover_image: '', is_featured: false
  };
  datesText = '';
  inclusionsText = '';

  ngOnInit() {
    this.api.getCollections().subscribe(c => this.collections.set(c));
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.adminGetTrips().subscribe(trips => {
        const t = trips.find(x => x.id === this.id);
        if (t) {
          this.model = { ...t };
          delete (this.model as Record<string, unknown>)['collections'];
          this.datesText = (t.upcoming_dates || []).join(', ');
          this.inclusionsText = (t.inclusions || []).join(', ');
        }
      });
    }
  }

  save() {
    if (!this.model.title || !this.model.slug || !this.model.price) {
      this.error.set('Title, slug and price are required.'); return;
    }
    const payload: Partial<Trip> = {
      ...this.model,
      upcoming_dates: this.datesText.split(',').map(s => s.trim()).filter(Boolean),
      inclusions: this.inclusionsText.split(',').map(s => s.trim()).filter(Boolean)
    };
    this.busy.set(true); this.error.set('');
    const req = this.id
      ? this.api.adminUpdateTrip(this.id, payload)
      : this.api.adminCreateTrip(payload);
    req.subscribe({
      next: () => this.router.navigate(['/admin']),
      error: e => { this.error.set(e?.error?.error || 'Save failed.'); this.busy.set(false); }
    });
  }
}
