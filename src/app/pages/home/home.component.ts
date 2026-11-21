import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { Trip, Collection, BlogPost } from '../../core/models';
import { TripCardComponent } from '../../shared/trip-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TripCardComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <p class="eyebrow">Group trips · Treks · Getaways</p>
        <h1>Chalo, kuch<br><em>majestic karte hain</em></h1>
        <p class="lead">Travel with strangers, return with friends. Fixed-departure group
          trips across India and beyond — planned end to end, so you just show up.</p>
        <div class="cta-row">
          <a routerLink="/collections" class="btn btn-accent">Explore trips</a>
          <a routerLink="/about-us" class="btn btn-ghost hero-ghost">Our story</a>
        </div>
      </div>
    </section>

    <!-- Featured trips -->
    <section class="section container">
      <p class="eyebrow">Handpicked</p>
      <h2>Featured departures</h2>
      <div class="grid grid-3" style="margin-top: 24px">
        <app-trip-card *ngFor="let t of featured()" [trip]="t" />
      </div>
    </section>

    <!-- Collections -->
    <section class="section container">
      <p class="eyebrow">Browse by mood</p>
      <h2>Trip collections</h2>
      <div class="grid grid-3" style="margin-top: 24px">
        <a *ngFor="let c of collections()" [routerLink]="['/collections', c.slug]" class="card coll">
          <h3>{{ c.name }}</h3>
          <p class="muted">{{ c.tagline }}</p>
          <span class="go">Explore →</span>
        </a>
      </div>
    </section>

    <!-- Why us -->
    <section class="section container why">
      <p class="eyebrow">Why travel with us</p>
      <h2>More than just a destination</h2>
      <div class="grid grid-3" style="margin-top: 24px">
        <div class="card pad"><h3>Curated itineraries</h3>
          <p class="muted">Every route is designed for maximum experience, not just sightseeing checklists.</p></div>
        <div class="card pad"><h3>Safe group travel</h3>
          <p class="muted">Verified trip leaders, small groups, and a community that looks out for each other.</p></div>
        <div class="card pad"><h3>Budget friendly</h3>
          <p class="muted">Travel more, spend less — without compromising on the moments that matter.</p></div>
      </div>
    </section>

    <!-- Guides -->
    <section class="section container" *ngIf="blogs().length">
      <p class="eyebrow">Travel guides</p>
      <h2>Before you pack</h2>
      <div class="grid grid-3" style="margin-top: 24px">
        <a *ngFor="let b of blogs()" [routerLink]="['/blog', b.slug]" class="card pad blog">
          <h3>{{ b.title }}</h3>
          <p class="muted">{{ b.excerpt }}</p>
          <span class="go">Read more →</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .hero { background: linear-gradient(160deg, var(--ink) 0%, var(--pine-deep) 90%);
      color: #fff; padding: 96px 0 88px; }
    .hero h1 { color: #fff; }
    .hero h1 em { color: var(--marigold); font-style: normal; }
    .lead { max-width: 560px; font-size: 1.08rem; color: #d7e0da; }
    .cta-row { display: flex; gap: 14px; margin-top: 28px; flex-wrap: wrap; }
    .hero-ghost { color: #fff; border-color: rgba(255,255,255,0.35); }
    .coll, .blog { padding: 26px; display: block; color: var(--ink); }
    .coll:hover, .blog:hover { box-shadow: var(--shadow); }
    .go { color: var(--pine); font-weight: 600; font-size: 0.9rem; }
    .pad { padding: 26px; }
  `]
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  featured = signal<Trip[]>([]);
  collections = signal<Collection[]>([]);
  blogs = signal<BlogPost[]>([]);

  ngOnInit() {
    this.api.getTrips({ featured: true }).subscribe(t => this.featured.set(t.slice(0, 6)));
    this.api.getCollections().subscribe(c => this.collections.set(c));
    this.api.getBlogs().subscribe(b => this.blogs.set(b.slice(0, 3)));
  }
}
