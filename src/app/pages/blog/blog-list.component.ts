import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { BlogPost } from '../../core/models';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section container">
      <p class="eyebrow">Travel guides</p>
      <h1>Read before you wander</h1>
      <div class="grid grid-3" style="margin-top: 28px">
        <a *ngFor="let b of posts()" [routerLink]="['/blog', b.slug]" class="card pad">
          <h3>{{ b.title }}</h3>
          <p class="muted">{{ b.excerpt }}</p>
          <span class="go">Read more →</span>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .pad { padding: 26px; display: block; color: var(--ink); }
    .pad:hover { box-shadow: var(--shadow); }
    .go { color: var(--pine); font-weight: 600; }
  `]
})
export class BlogListComponent implements OnInit {
  private api = inject(ApiService);
  posts = signal<BlogPost[]>([]);
  ngOnInit() { this.api.getBlogs().subscribe(p => this.posts.set(p)); }
}
