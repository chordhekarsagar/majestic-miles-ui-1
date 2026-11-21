import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Trip } from '../../core/models';
import { GalleryComponent } from '../../shared/gallery.component';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GalleryComponent],
  template: `
    <section class="section container" *ngIf="trip() as t">
      <a *ngIf="t.collections" [routerLink]="['/collections', t.collections.slug]" class="crumb">
        ← {{ t.collections.name }}
      </a>
      <div class="head">
        <div>
          <h1>{{ t.title }}</h1>
          <p class="muted" *ngIf="t.location">📍 {{ t.location }}</p>
          <div class="meta">
            <span class="badge">{{ t.duration_label || t.duration_days + ' Days' }}</span>
            <span class="badge">{{ t.difficulty }}</span>
            <span class="badge gold" *ngIf="t.is_featured">Featured</span>
          </div>
        </div>
        <div class="price-box card">
          <span class="muted from">Starting from</span>
          <strong>₹{{ t.price | number:'1.0-0' }}</strong>
          <a href="#book" class="btn btn-accent">Book this trip</a>
        </div>
      </div>

      <app-gallery [items]="t.gallery || []" />

      <div class="cols">
        <div>
          <h2>About this trip</h2>
          <p>{{ t.description || t.summary }}</p>

          <h2>Itinerary</h2>
          <ol class="itinerary">
            <li *ngFor="let d of t.itinerary">
              <span class="day">Day {{ d.day }}</span>
              <div><strong>{{ d.title }}</strong><p class="muted">{{ d.details }}</p></div>
            </li>
          </ol>

          <div class="grid grid-2">
            <div *ngIf="t.inclusions?.length">
              <h3>Inclusions</h3>
              <ul><li *ngFor="let i of t.inclusions">✓ {{ i }}</li></ul>
            </div>
            <div *ngIf="t.exclusions?.length">
              <h3>Exclusions</h3>
              <ul><li *ngFor="let e of t.exclusions">✗ {{ e }}</li></ul>
            </div>
          </div>

          <div *ngIf="t.upcoming_dates?.length">
            <h3>Upcoming dates</h3>
            <div class="dates">
              <span class="badge" *ngFor="let d of t.upcoming_dates">{{ d | date:'d MMM y' }}</span>
            </div>
          </div>
        </div>

        <!-- Booking form -->
        <aside id="book" class="card book">
          <h3>Book / enquire</h3>
          <p class="ok" *ngIf="booked()">🎉 Enquiry received! We'll call you shortly to confirm.</p>
          <form *ngIf="!booked()" (ngSubmit)="submit(t)">
            <label for="name">Full name</label>
            <input id="name" name="name" [(ngModel)]="form.full_name" required>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" [(ngModel)]="form.email" required>
            <label for="phone">Phone</label>
            <input id="phone" name="phone" [(ngModel)]="form.phone" required>
            <label for="trav">Travellers</label>
            <input id="trav" name="trav" type="number" min="1" [(ngModel)]="form.travellers">
            <label for="date">Preferred date</label>
            <select id="date" name="date" [(ngModel)]="form.travel_date">
              <option value="">Any date</option>
              <option *ngFor="let d of t.upcoming_dates" [value]="d">{{ d | date:'d MMM y' }}</option>
            </select>
            <label for="msg">Message (optional)</label>
            <textarea id="msg" name="msg" rows="3" [(ngModel)]="form.message"></textarea>
            <button class="btn btn-primary" type="submit" [disabled]="sending()">
              {{ sending() ? 'Sending…' : 'Send enquiry' }}
            </button>
            <p class="err" *ngIf="error()">{{ error() }}</p>
          </form>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    .crumb { display: inline-block; margin-bottom: 14px; font-weight: 500; }
    .head { display: flex; justify-content: space-between; gap: 24px;
      align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; }
    .meta { display: flex; gap: 8px; margin-top: 10px; }
    .price-box { padding: 20px 26px; display: flex; flex-direction: column;
      gap: 6px; align-items: flex-start; }
    .price-box strong { font-family: var(--display); font-size: 1.9rem; }
    .from { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .cols { display: grid; grid-template-columns: 1.6fr 1fr; gap: 36px; margin-top: 40px; }
    @media (max-width: 860px) { .cols { grid-template-columns: 1fr; } }
    .itinerary { list-style: none; padding: 0; margin: 0 0 28px; }
    .itinerary li { display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line); }
    .day { flex-shrink: 0; font-family: var(--display); font-weight: 800;
      color: var(--pine); width: 64px; }
    ul { padding-left: 0; list-style: none; }
    ul li { padding: 3px 0; }
    .dates { display: flex; gap: 8px; flex-wrap: wrap; }
    .book { padding: 24px; position: sticky; top: 90px; }
    .ok { background: #eaf6ef; border: 1px solid #bfe3cd; padding: 14px;
      border-radius: 10px; color: var(--pine-deep); }
    .err { color: #b3372f; font-size: 0.88rem; }
  `]
})
export class TripDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  trip = signal<Trip | null>(null);
  sending = signal(false);
  booked = signal(false);
  error = signal('');

  form = { full_name: '', email: '', phone: '', travellers: 1, travel_date: '', message: '' };

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.api.getTrip(p.get('slug')!).subscribe(t => this.trip.set(t));
    });
  }

  submit(t: Trip) {
    if (!this.form.full_name || !this.form.email || !this.form.phone) {
      this.error.set('Name, email and phone are required.');
      return;
    }
    this.sending.set(true);
    this.error.set('');
    this.api.createBooking({
      trip_id: t.id, ...this.form,
      travel_date: this.form.travel_date || undefined
    }).subscribe({
      next: () => { this.booked.set(true); this.sending.set(false); },
      error: () => { this.error.set('Something went wrong — please try again.'); this.sending.set(false); }
    });
  }
}
