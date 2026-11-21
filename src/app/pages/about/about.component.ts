import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section container narrow">
      <p class="eyebrow">Our story</p>
      <h1>It started with one question</h1>
      <p>"Chalo, kuch majestic karte hain" — let's go make something majestic. A group of
      friends said it before every trip so often that they turned the line into a travel company.
      What began as weekend escapes with a few strangers has grown into a community
      of explorers who believe a trip is measured in stories, not kilometres.</p>
      <p>Today we run fixed-departure group trips across India and beyond: monsoon
      treks in the Sahyadris, houseboats in Kashmir, root bridges in Meghalaya and
      full-moon parties in Thailand. Every itinerary is planned end to end — stays,
      transport, food, permits — so all you have to do is show up with a backpack.</p>

      <h2>What we stand for</h2>
      <div class="grid grid-3">
        <div class="card pad"><h3>Community first</h3>
          <p class="muted">Solo travellers welcome. Most people arrive alone and leave with a group chat that never goes quiet.</p></div>
        <div class="card pad"><h3>Safety always</h3>
          <p class="muted">Certified trek leaders, vetted stays, first-aid trained crew and small group sizes.</p></div>
        <div class="card pad"><h3>Honest pricing</h3>
          <p class="muted">What you see is what you pay. No surprise "taxes extra" at checkout.</p></div>
      </div>

      <a routerLink="/collections" class="btn btn-primary" style="margin-top: 32px">Browse our trips</a>
    </section>
  `,
  styles: [`
    .narrow { max-width: 820px; }
    .narrow p { font-size: 1.02rem; }
    h2 { margin-top: 40px; }
    .pad { padding: 24px; }
  `]
})
export class AboutComponent {}
