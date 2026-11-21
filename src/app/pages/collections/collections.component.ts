import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Collection } from '../../core/models';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section container">
      <p class="eyebrow">All collections</p>
      <h1>Where do you want to wander?</h1>
      <div class="grid grid-2" style="margin-top: 28px">
        <a *ngFor="let c of collections()" [routerLink]="['/collections', c.slug]" class="card coll">
          <h2>{{ c.name }}</h2>
          <p class="tagline">{{ c.tagline }}</p>
          <p class="muted">{{ c.description }}</p>
          <span class="go">See trips →</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .coll { padding: 32px; display: block; color: var(--ink); }
    .coll:hover { box-shadow: var(--shadow); }
    .tagline { color: var(--pine); font-weight: 600; }
    .go { color: var(--pine); font-weight: 600; }
  `]
})
export class CollectionsComponent implements OnInit {
  private api = inject(ApiService);
  collections = signal<Collection[]>([]);
  ngOnInit() { this.api.getCollections().subscribe(c => this.collections.set(c)); }
}
