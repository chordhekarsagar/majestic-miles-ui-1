import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { Collection, Trip } from '../../core/models';
import { TripCardComponent } from '../../shared/trip-card.component';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TripCardComponent],
  template: `
    <section class="section container" *ngIf="collection() as c">
      <p class="eyebrow">Collection</p>
      <h1>{{ c.name }}</h1>
      <p class="muted" style="max-width: 640px">{{ c.description }}</p>

      <div class="toolbar">
        <span class="muted">Showing {{ sorted().length }} trips</span>
        <label class="sort">Sort by
          <select [(ngModel)]="sort" name="sort">
            <option value="newest">Newest first</option>
            <option value="price_asc">Lowest price</option>
            <option value="price_desc">Highest price</option>
            <option value="duration">Shortest first</option>
          </select>
        </label>
      </div>

      <div class="grid grid-3">
        <app-trip-card *ngFor="let t of sorted()" [trip]="t" />
      </div>
      <p *ngIf="!sorted().length" class="muted">No trips in this collection yet — check back soon.</p>
    </section>
  `,
  styles: [`
    .toolbar { display: flex; justify-content: space-between; align-items: center;
      margin: 26px 0 20px; flex-wrap: wrap; gap: 12px; }
    .sort { display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .sort select { width: auto; margin: 0; }
  `]
})
export class CollectionDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);

  collection = signal<Collection | null>(null);
  sort = 'newest';

  sorted = computed(() => {
    const trips = [...(this.collection()?.trips ?? [])];
    switch (this.sortSignal()) {
      case 'price_asc':  return trips.sort((a, b) => a.price - b.price);
      case 'price_desc': return trips.sort((a, b) => b.price - a.price);
      case 'duration':   return trips.sort((a, b) => a.duration_days - b.duration_days);
      default:           return trips;
    }
  });
  private sortSignal = signal('newest');

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      const slug = p.get('slug')!;
      this.api.getCollection(slug).subscribe(c => this.collection.set(c));
    });
  }

  ngDoCheck() { this.sortSignal.set(this.sort); }
}
