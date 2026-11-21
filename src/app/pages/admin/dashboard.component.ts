import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Trip, Booking } from '../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section container">
      <div class="top">
        <div><p class="eyebrow">Admin</p><h1>Dashboard</h1></div>
        <div class="actions">
          <a routerLink="/admin/trips/new" class="btn btn-primary">+ New trip</a>
          <button class="btn btn-ghost" (click)="logout()">Sign out</button>
        </div>
      </div>

      <div class="tabs">
        <button [class.on]="tab() === 'trips'" (click)="tab.set('trips')">Trips ({{ trips().length }})</button>
        <button [class.on]="tab() === 'bookings'" (click)="tab.set('bookings')">Bookings ({{ bookings().length }})</button>
      </div>

      <!-- Trips -->
      <table *ngIf="tab() === 'trips'" class="tbl">
        <thead><tr><th>Trip</th><th>Collection</th><th>Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let t of trips()">
            <td><strong>{{ t.title }}</strong><br><span class="muted">{{ t.duration_label }}</span></td>
            <td>{{ t.collections?.name || '—' }}</td>
            <td>₹{{ t.price | number:'1.0-0' }}</td>
            <td><span class="badge" [class.gold]="t.is_active">{{ t.is_active ? 'Active' : 'Hidden' }}</span></td>
            <td class="row-actions">
              <a [routerLink]="['/admin/trips', t.id]">Edit</a>
              <button *ngIf="t.is_active" class="link danger" (click)="hide(t)">Hide</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Bookings -->
      <table *ngIf="tab() === 'bookings'" class="tbl">
        <thead><tr><th>Trip</th><th>Guest</th><th>Contact</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          <tr *ngFor="let b of bookings()">
            <td>{{ b.trips?.title || '—' }}</td>
            <td>{{ b.full_name }} <span class="muted">×{{ b.travellers }}</span></td>
            <td>{{ b.email }}<br><span class="muted">{{ b.phone }}</span></td>
            <td>{{ b.travel_date ? (b.travel_date | date:'d MMM y') : 'Any' }}</td>
            <td>
              <select [value]="b.status" (change)="setStatus(b, $any($event.target).value)">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="tab() === 'bookings' && !bookings().length" class="muted">No bookings yet.</p>
    </section>
  `,
  styles: [`
    .top { display: flex; justify-content: space-between; align-items: flex-end;
      flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
    .actions { display: flex; gap: 10px; }
    .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
    .tabs button { padding: 9px 18px; border-radius: 999px; border: 1.5px solid var(--line);
      background: #fff; font-weight: 600; cursor: pointer; }
    .tabs button.on { background: var(--ink); color: #fff; border-color: var(--ink); }
    .tbl { width: 100%; border-collapse: collapse; background: #fff;
      border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
    .tbl th, .tbl td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--line);
      vertical-align: top; font-size: 0.92rem; }
    .tbl th { background: var(--cloud); font-size: 0.78rem; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--slate); }
    .tbl select { width: auto; margin: 0; padding: 6px 10px; }
    .row-actions { display: flex; gap: 12px; }
    .link { background: none; border: none; cursor: pointer; font: inherit;
      font-weight: 500; color: var(--pine); padding: 0; }
    .danger { color: #b3372f; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  tab = signal<'trips' | 'bookings'>('trips');
  trips = signal<Trip[]>([]);
  bookings = signal<Booking[]>([]);

  ngOnInit() { this.load(); }

  load() {
    this.api.adminGetTrips().subscribe({
      next: t => this.trips.set(t),
      error: () => this.router.navigate(['/admin/login'])
    });
    this.api.adminGetBookings().subscribe(b => this.bookings.set(b));
  }

  hide(t: Trip) {
    if (!confirm(`Hide "${t.title}" from the public site?`)) return;
    this.api.adminDeleteTrip(t.id).subscribe(() => this.load());
  }

  setStatus(b: Booking, status: string) {
    this.api.adminUpdateBooking(b.id!, status).subscribe(() => this.load());
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
